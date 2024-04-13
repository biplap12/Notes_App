import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const PasswordInput = ({
    placeholder,
    value,
    onChange
}) => {

    const [isshowPassword, setIsShowPassword] = useState(false)
    const  tooglePassword = () => {
        setIsShowPassword(!isshowPassword)
    };


  return (
    <>
    <div className="flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3">
        <input
            type={isshowPassword ? "text" : "password"}
            placeholder={placeholder || "Password"}
            value={value}
            onChange={onChange}
            className="w-full py-3 outline-none bg-transparent text-sm mr-3 rounded"
        />
        { isshowPassword ?
        <FaRegEye
            onClick={() => tooglePassword()}
            className="text-gray-400 cursor-pointer"
            size={22}
        /> :
        <FaRegEyeSlash
            onClick={() => tooglePassword()}
            className="text-gray-400 cursor-pointer"
            size={22}
        />}
        
    
    </div>
    </>
  )
}

export default PasswordInput