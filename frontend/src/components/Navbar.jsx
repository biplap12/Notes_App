import React, { useState } from 'react'
import ProfileInfo from './Card/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar/SearchBar'
import toast from 'react-hot-toast'


const Navbar = ({userInfo, searchNotes,clearSearch }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const onLogout = () => {
        localStorage.clear();
        toast.success("Logged out successfully");
        navigate("/login")
    };

    const handleSearch = () => {
       if(searchQuery){
        searchNotes(searchQuery);
       }
    }

    const onClearSearch = () => {
        setSearchQuery("");
        clearSearch();
    }

  return (
    <>
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>

        <SearchBar 
        value={searchQuery}
        onChange={({target}) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        />

        <ProfileInfo userInfo={userInfo} OnLogout={onLogout}
        />
    </div>
    </>
  )
}

export default Navbar