'use client';

import React, { useState, useEffect } from 'react';
import { LoginApi } from '../../api/auth';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

export default function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        cuit: '',
        phone: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (Cookies.get('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await LoginApi.register({
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                cuit: formData.cuit,
                phone: formData.phone,
                password: formData.password,
            });

            setToken(response);
            setSuccess('Registro exitoso!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al registrar:', error);
            setError('Error en la solicitud: ' + (error.response?.data?.message || 'Inténtalo de nuevo.'));
        }
    };

    const setToken = (response) => {
        Cookies.set('token', response.token, { expires: 7, sameSite: 'None', secure: true });
        Cookies.set('name', response.name, { expires: 7, sameSite: 'None', secure: true });
        Cookies.set('surname', response.surname, { expires: 7, sameSite: 'None', secure: true });
        Cookies.set('email', response.email, { expires: 7, sameSite: 'None', secure: true });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error &&
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-monza-700 text-monza-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">

                        <p className="text-sm">{error}</p>
                        <button
                            className="ml-auto flex items-center justify-center text-white hover:bg-red-800 rounded-full px-1"
                            onClick={() => setError(null)}
                        >
                            <X className='w-4' />
                        </button>
                    </div>
                </div>
            }

            {success &&
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-emerald-700 text-emerald-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">

                        <p className="text-sm">{success}</p>
                        <button
                            className="ml-auto flex items-center justify-center text-white hover:bg-emerald-800 rounded-full px-1"
                            onClick={() => setError(null)}
                        >
                            <X className='w-4' />
                        </button>
                    </div>
                </div>
            }

            <div>
                <label className="block text-gray-700">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2"
                />
            </div>

            <div>
                <label className="block text-gray-700">Apellido</label>
                <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2"
                />
            </div>

            <div>
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2"
                />
            </div>

            <div>
                <label className="block text-gray-700">CUIT</label>
                <input
                    type="text"
                    name="cuit"
                    value={formData.cuit}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2"
                />
            </div>

            <div>
                <label className="block text-gray-700">Teléfono</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2"
                />
            </div>

            <div>
                <label className="block text-gray-700">Contraseña</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded p-2"
                />
            </div>

            <button type="submit" className="bg-red-600 text-white rounded w-full py-2">
                Registrarse
            </button>
        </form>
    );
}
