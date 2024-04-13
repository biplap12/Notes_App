import React from 'react'
import { getInitials } from '../../utils/helper';

const ProfileInfo = (
    {OnLogout}
) => {
   
  return (
    <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-900 font-medium bg-slate-100">
            {getInitials("Biplap Neupane")}
            </div>
        <div>
            <div className="text-sm font-medium">Biplap Neupane</div>
            <button onClick={OnLogout} className="text-sm text-slate-700 underline">
                Logout
            </button>
        </div>
    </div>
  )
}

export default ProfileInfo