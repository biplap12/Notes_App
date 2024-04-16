import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <img src={imgSrc} alt="No Notes" className="w-auto" />
      <h6 className="w-1/2 text-sm font-medium text-slate-700 leading-7 mt-5">
        {message}
      </h6>
    </div>
  );
};

export default EmptyCard;
