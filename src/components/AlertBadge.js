import React from 'react';
const Badge = ({ value, color }) => {
    const colorClasses = {
        green: 'bg-emerald-600/80 text-emerald-200',
        red: 'bg-red-500 text-red-800',
        yellow: 'bg-yellow-200 text-yellow-800',
        gray: 'bg-zinc-400 text-zinc-200',
    };

    return (
        <span className={` items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses[color]}`}>
            {value}
        </span>
    );
};

export default Badge;