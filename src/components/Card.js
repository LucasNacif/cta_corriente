import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-xl border-[1px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;