// Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="flex min-h-screen">
            <div className="hidden w-64 flex-col bg-gray-100 p-4 lg:flex">
                <h1 className="mb-4 text-2xl font-bold">Proveedor Dashboard</h1>
                <nav>
                    <ul>
                        <Link to="/">Login</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/cuentas">Cuentas</Link>
                        <Link to="/movimientos">Movimientos</Link>
                        <Link to="/comprobantes">Comprobantes</Link>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
