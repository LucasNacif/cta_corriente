import React from 'react';
import Sidebar from '../sidebar/Sidebar';

const LayoutSidebar = ({ children }) => {
    return (
        <div className='flex h-screen bg-monza-900/95'>
            <div className='fixed top-0 left-0 h-full hidden lg:flex'>
                <Sidebar />
            </div>
            <main className='lg:ml-52 m-1 p-6 flex-1 overflow-y-auto bg-zinc-200 rounded-xl'>
                <div className='h-full'>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default LayoutSidebar;
