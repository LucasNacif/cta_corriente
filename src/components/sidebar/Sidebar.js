import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SideLink from '../sidebar/SideLink';
import { Home, ArrowLeftRight, Users, ReceiptText, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('name');
        Cookies.remove('surname');
        Cookies.remove('email');
        navigate('/');
    };
    const userName = Cookies.get('name');
    const userSurname = Cookies.get('surname');
    const userEmail = Cookies.get('email');

    return (
        <div className="flex h-screen text-monza-200">
            <div className="hidden w-52 flex-col lg:flex p-2">
                <div className="flex items-center mb-6 p-2 space-x-2">
                    <img src="/logo.png" alt="Logo" className="h-7 w-7" />
                    <div>
                        <p className="text-xs font-bold text-white">Piezas Ya</p>
                        <p className='text-xs font-extralight'>Proveedores</p>
                    </div>
                </div>

                <nav>
                    <ul className="space-y-2">
                        <li>
                            <SideLink to="/dashboard" icon={Home}>Dashboard</SideLink>
                        </li>
                        <li>
                            <SideLink to="/cuentas" icon={Users}>Cuentas</SideLink>
                        </li>
                        <li>
                            <SideLink to="/movimientos" icon={ArrowLeftRight}>Movimientos</SideLink>
                        </li>
                        <li>
                            <SideLink to="/usocomponents" icon={ReceiptText}>Componentes Ej.</SideLink>
                        </li>
                    </ul>
                </nav>
                <div className="mt-auto p-2 border-t flex justify-between border-monza-400/80">
                    <div className="text-sm text-white">
                        {/* <p>{user.name}</p>
                        <p>{user.email}</p> */}
                        <p className='text-sm font-semibold'>{userSurname}, {userName}</p>
                        <p className='text-xs text-monza-300'>{userEmail}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-monza-950/70 bg-monza-400/80 rounded-lg"
                    >
                        <LogOut className="w-4 h-4 m-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;