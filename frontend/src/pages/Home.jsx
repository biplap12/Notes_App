import React, { useEffect, useState } from 'react'
import Notecard from '../components/Card/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import axiosInstance from '../utils/axiosInstance'
import moment from 'moment'
import Toast from '../components/ToastMessage/Toast'
import EmptyCard from '../components/Card/EmptyCard'
import icon from "../assets/addcardicon.png"
import empty from "../assets/empty.png"



const Home = () => {
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown:false,
    type:"add",
    data:null
  });


  const [showToastMsg, setShowToastMsg] = useState({
    isShown:false,
    type:"add",
    message:""
  });
  
  const [allNotes, setAllNotes] = useState([]); 
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEditNote = (note) => {
    setOpenAddEditModel({
      isShown:true,
      type:"edit",
      data:note
    })
  }

 

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown:false,
      type:"add",
      message:""
    })
  }

  const handleShowToast = (type, message) => {
    setShowToastMsg({
      isShown:true,
      type,
      message
    })
  }


  //get user info

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    }
      catch (error) {
        if(error.response && error.response.status === 401){
          navigate('/login');
          localStorage.clear();
        }
      }
  }

  const getNotes = async () => {
    try {
      const response = await axiosInstance.get('/get_all_notes');
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes);
      }
    }
      catch (error) {
        if(error.response && error.response.status === 401){
          navigate('/login');
          localStorage.clear();
        }
      }
  }

  // delete note
  const deleteNote = async (noteData) => {
     const noteId = noteData._id;
      try {
        const response = await axiosInstance.delete(`/delete-note/${noteId}`);
         console.log(response);
        if(response.status === 200){
          getNotes()
          handleShowToast( "delete",response.data.message);
        }        
      } catch (error) {
        if(error.response && error.response.data && error.response.data.error){
          handleShowToast("error",error.response.data.error);
        }
      }
  }

  //search notes
  const searchNotes = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes",
      {
        params:{ query }  
      });
      if(response.data && response.data.notes){
        setAllNotes(response.data.notes);
        setIsSearch(true);
      }
    }
      catch (error) {
        if(error.response && error.response.status === 401){
          navigate('/login');
          localStorage.clear();
        }
      }
  }
  

  //clear search
  const clearSearch = async () => {
    getNotes();
    setIsSearch(false);
  }

  //update pinned note
  const updatePinnedNote = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(`/update_note_pinned/${noteId}`,{
        isPinned:!noteData.isPinned
      });
      if(response.data && response.data.note){
        getNotes();
        handleShowToast("success",response.data.message);
      }
    } catch (error) {
      if(error.response && error.response.data && error.response.data.error){
        handleShowToast("error",error.response.data.error);
      }
      
    }
  }

   


  useEffect(() => {
    getUserInfo();
    getNotes();
    return () => {};
  }
  , [])


  return (
    <>
    <Navbar userInfo={userInfo} searchNotes={searchNotes} clearSearch={clearSearch} />
    <div className="container mx-auto">
    {allNotes.length > 0 ? (<div className="grid grid-cols-3 gap-2 m-10">
 { allNotes.map((note, index) => (
    <Notecard 
      key={index}
      title={note.title} 
      // date={note.createdOn.split('T')[0]}
      // 16T16:28:19.934Z
      date={moment(note.createdOn).format('D MMM YYYY')}
      content={note.content} 
      tags={note.tags}
      isPinned={note.isPinned} 
      onEdit={() => {handleEditNote(note)}}
      onDelete={() => {deleteNote(note)}} 
      OnPinNote={() => {updatePinnedNote(note)}}

    />
  ))}
  </div> ):( 
  <EmptyCard
  imgSrc={isSearch ? empty : icon} message={isSearch ? `No Data Found` : `Add a new note by clicking the button below`} />
)}
    </div>

    <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
     onClick={()=>
      setOpenAddEditModel({
        isShown:true,
        type:"add",
        data:null
      })
    }
    >
      <MdAdd className="text-[32px] text-white" />
    </button>
    
    <Modal
     isOpen={openAddEditModel.isShown} 
    onRequestClose={()=>{}}
    style={{
      overlay:{
        backgroundColor:'rgba(0,0,0,0.2)'
      },
    }}
    contentLabel=""
    className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
    >


    <AddEditNotes 
    type={openAddEditModel.type}
    noteData={openAddEditModel.data}
    onClose={()=>
      setOpenAddEditModel({
        isShown:false,
        type:"add",
        data:null
      })
    }
    getNotes={getNotes}
    handleShowToast={handleShowToast}
    />
    </Modal>

    <Toast
    isShown={showToastMsg.isShown}
    message={showToastMsg.message}
    type={showToastMsg.type}
    onClose={handleCloseToast}
    />
      
    </>
  )
}

export default Home
