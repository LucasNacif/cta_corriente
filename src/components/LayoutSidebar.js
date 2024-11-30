import React from 'react';
import Sidebar from './Sidebar';

const LayoutSidebar = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ flex: 1 }}>{children}</main>
        </div>
    );
};

export default LayoutSidebar;
