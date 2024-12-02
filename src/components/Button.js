import React from 'react';

const Button = ({ icon: Icon, label, onClick, color, className }) => {
  const colorClasses = {
    green: 'bg-emerald-600 hover:bg-emerald-700 text-emerald-200',
    red: 'bg-red-600 hover:bg-red-700 text-red-200',
    neutral: 'bg-zinc-400 hover:bg-zinc-500 text-zinc-200',
    blue: 'bg-blue-500 hover:bg-blue-700 text-blue-200',

    green2: 'bg-zinc-500 hover:bg-emerald-700 text-emerald-400',
    red2: 'bg-zinc-500 hover:bg-red-700 text-red-400',
    neutral2: 'bg-zinc-500 hover:bg-zinc-700 text-zinc-300',
    blue2: 'bg-zinc-500 hover:bg-blue-700 text-blue-400',

    green3: ' border border-emerald-600 hover:bg-emerald-200 text-emerald-600',
    red3: 'border border-red-600 hover:bg-red-200 text-red-600',
    neutral3: 'border border-zinc-400 hover:bg-zinc-300 text-zinc-600',
    blue3: 'border border-blue-500 hover:bg-blue-200 text-blue-600',
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center text-white text-sm font-medium py-[7px] px-4 rounded-md ${colorClasses[color]}  ${className}`}
    >
      {Icon && <Icon className={`${label ? 'mr-2':''} w-4 h-4`} />}
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
