'use client';

import React, { useState, useEffect } from 'react';
import { LoginApi } from '../../api/auth';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        cuit: '',
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
            const response = await LoginApi.login({
                email: formData.email,
                cuit: formData.cuit,
                password: formData.password,
            });
            console.log('Respuesta de inicio de sesión:', response); 
            setToken(response);
            setSuccess('Inicio de sesión exitoso!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
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
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            <div>
                <label className="block text-black">Email</label>
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
                <label className="block text-black">CUIT</label>
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
                <label className="block text-black">Contraseña</label>
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
                Iniciar Sesión
            </button>
        </form>
    );
}
