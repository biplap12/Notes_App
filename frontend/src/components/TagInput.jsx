import React, { useState } from 'react'
import { MdAdd, MdClose } from 'react-icons/md'

const TagInput = ({
    tags,
    setTags
}) => {

    const [inputValue, setInputValue] =useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    }

    const addNewTag = () => {
        if(inputValue.trim() !== ''){
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            addNewTag();
        }
    }
    const removeTag = (indexToRemove) => {
        setTags(tags.filter((tag) => tags.indexOf(tag) !== indexToRemove));
    }

  return (
    <div>
        {tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
            {tags.map((tag, index) => (
                <span key={index} className="flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded ">
                   #{tag}
                   <button onClick={() => setTags(tags.filter((item) => item !== tag))}>
                    <MdClose/>
                   </button>
                </span>
            ))}
        </div>
        )}
        <div className="flex items-center gap-4 mt-3">
            <input
                type="text"
                placeholder="Add tags"
                className="text-smoutline-none bg-slate-50 p-2 rounded bg-transparent border px-3 py-2 "
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                value={inputValue}

            />
            <button className="w-8 h-8 items-center justify-center rounded border border-blue-700 hover:bg-blue-400" onClick={()=>addNewTag()}>
                <MdAdd className='text-2xl text-blue-700 '/>
                </button>
        </div>

    </div>
  )
}

export default TagInput