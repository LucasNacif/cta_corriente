import React from 'react';

const Select = ({ label, options = [], className = '', ...props }) => {
    return (
        <div className="flex flex-col space-y-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <select
                className={`px-4 py-[10px] rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-monza-500 focus:border-transparent text-gray-800 text-sm ${className}`}
                {...props}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;