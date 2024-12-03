import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`rounded-lg border-[1px] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;