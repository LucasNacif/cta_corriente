import React from 'react';
import Sidebar from './Sidebar';

const LayoutSidebar = ({ children }) => {
    return (
        <div className='flex h-screen'>
            <div className='fixed top-0 left-0 h-full w-64 bg-emerald-800 shadow-md hidden lg:flex'>
                <Sidebar />
            </div>
            <main className='lg:ml-64 p-4 flex-1 overflow-y-auto bg-forest-green-50'>
                <div className='h-full'>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default LayoutSidebar;
