import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SideLink = ({ to, children, icon: Icon, activeIcon: ActiveIcon = ChevronRight }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block p-2 rounded-md text-sm font-medium ${isActive
        ? 'text-monza-950/70 bg-monza-400/80'
        : 'text-monza-300 hover:text-monza-200'
        }`}
    >
      <div className='flex justify-between items-center'>
        <div className='flex'>
          {Icon && <Icon className="w-4 h-auto mr-2" />}
          {children}
        </div>
        {isActive && <ActiveIcon size={16} className="text-monza-900" />}
      </div>
    </Link>
  );
};

export default SideLink;