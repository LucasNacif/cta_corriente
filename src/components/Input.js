import React from 'react';

const Input = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        className={`px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-monza-500 focus:border-transparent text-gray-800 text-sm ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
