import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        navigate('/');
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden w-64 flex-col bg-gray-100 p-4 lg:flex">
                <div className="flex items-center mb-6">
                    <img src="Logardodeberiairaca.com" alt="Logo" className="h-12 w-12 mr-2" />
                    <h1 className="text-2xl font-bold">Piezas Ya</h1>
                </div>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">Login</Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/cuentas" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">Cuentas</Link>
                        </li>
                        <li>
                            <Link to="/movimientos" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">Movimientos</Link>
                        </li>
                        <li>
                            <Link to="/comprobantes" className="block p-2 text-gray-700 hover:bg-gray-200 rounded">Comprobantes</Link>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto">
                    <button 
                        onClick={handleLogout} 
                        className="w-full bg-red-500 text-white rounded py-2 mt-4 hover:bg-red-600"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;