import React from 'react';

const Button = ({ icon: Icon, label, onClick, color, className }) => {
  const colorClasses = {
    green: 'bg-emerald-300 hover:bg-emerald-400 text-emerald-700 border-emerald-700',
    red: 'bg-monza-300 hover:bg-monza-400 text-red-700 border-red-700',
    neutral: 'bg-zinc-300 hover:bg-zinc-400 text-zinc-700 border-zinc-700',
    blue: 'bg-blue-300 hover:bg-blue-400 text-blue-700 border-blue-700',
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-white text-sm font-medium py-[7px] px-4 rounded-xl shadow-lg border-[1px] ${colorClasses[color]}  ${className}`}
    >
      {Icon && <Icon className={`${label ? 'mr-2':''} w-4 h-4`} />}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
