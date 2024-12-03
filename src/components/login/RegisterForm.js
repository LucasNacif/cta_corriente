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
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [error, setError] = useState(null); 

    useEffect(() => {
        if (Cookies.get('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'name':
            case 'surname':
                if (!/^[A-Za-z\s]{2,50}$/.test(value)) {
                    error = 'Debe contener solo letras y al menos 2 caracteres.';
                }
                break;

            case 'email':
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Formato de email inválido.';
                }
                break;

            case 'cuit':
                if (!/^\d{11}$/.test(value)) {
                    error = 'El CUIT debe contener 11 números.';
                }
                break;

            case 'phone':
                if (!/^\d{10,15}$/.test(value)) {
                    error = 'El teléfono debe contener entre 10 y 15 números.';
                }
                break;

            case 'password':
                if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(value)) {
                    error = 'La contraseña debe tener mínimo 8 caracteres, incluyendo letras, números y signos.';
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));

        if (error) {
            setError(error);
        } else {
            setError(null); 
        }

        return error === '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = Object.keys(formData).every((key) =>
            validateField(key, formData[key])
        );

        if (!valid) {
            return;
        }

        try {
            const response = await LoginApi.register(formData);
            if(response){
                setToken(response);
                navigate('/dashboard');
            }
            
        } catch (error) {
            console.error('Error al registrar:', error);
            setErrors({ general: 'Error en la solicitud: Inténtalo de nuevo.' });
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
            {/* Mensaje de error general flotante */}
            {error && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-monza-700/80 text-monza-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">
                        <p className="text-sm">{error}</p>
                        <button
                            className="ml-auto flex items-center justify-center text-white hover:bg-red-800 rounded-full px-1"
                            onClick={() => setError(null)}
                        >
                            <X className='w-4' />
                        </button>
                    </div>
                </div>
            )}

            {/* Mensaje de error general en el formulario */}
            {errors.general && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-monza-700/80 text-monza-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">
                        <p className="text-sm">{errors.general}</p>
                        <button
                            className="ml-auto flex items-center justify-center text-white hover:bg-red-800 rounded-full px-1"
                            onClick={() => setError(null)}
                        >
                            <X className='w-4' />
                        </button>
                    </div>
                </div>
            )}

            {/* Mensaje de éxito */}
            {success && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
                    <div className="bg-emerald-700 text-emerald-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">
                        <p className="text-sm">{success}</p>
                        <button
                            className="ml-auto flex items-center justify-center text-white hover:bg-emerald-800 rounded-full px-1"
                            onClick={() => setSuccess(null)}
                        >
                            <X className="w-4" />
                        </button>
                    </div>
                </div>
            )}


            {/* Campos de formulario */}
            <div>
                <label className="block text-black">Nombre</label>
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
                <label className="block text-black">Apellido</label>
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
                <label className="block text-black">Teléfono</label>
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
                Registrarse
            </button>
        </form>
    );
}
