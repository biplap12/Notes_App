import React from 'react'
import { MdOutlinePushPin } from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'
import moment from 'moment'

const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    OnPinNote
}) => {
  return (
    <div className="border p-4 rounded bg-white hover:shadow-xl transition-all ease-in-out duration-150">
      <div className="flex justify-between items-center">
        <div>
        <h6 className="text-sm font-medium">
            {title}
        </h6>
        <span className="text-xs text-slate-500">
        {moment(date).format("Do MMM YYYY")}
        </span>
      </div>
      <MdOutlinePushPin onClick={OnPinNote} className={`icon-btn ${isPinned ? "text-primary" : "text-slate-500"}`}/>
      
        </div>
        <p className="text-xs text-slate-600 mt-2">
            {content?.slice(0, 60)}
        </p>
        <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-slate-500">
                {tags.map((tag) => `#${tag} `)}
            </div>
            <div className="flex items-center gap-2">
                <MdCreate onClick={onEdit} className="icon-btn hover:text-green-600"/>
                <MdDelete onClick={onDelete} className="icon-btn hover:text-red-600"/>
                </div>
        </div>
        </div>
  )
}

export default NoteCard