"use client"

import React, { useState } from 'react';
import { LoginApi } from '../api/auth';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    password: '',
    cuit: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const response = await LoginApi.login({
          email: formData.email,
          cuit: formData.cuit,
          password: formData.password
        });
        console.log('Respuesta de inicio de sesión:', response); 
        setToken(response.token);
        setSuccess('Inicio de sesión exitoso!');
        navigate('/dashboard');
      } else {
        const response = await LoginApi.register({
          name: formData.name,
          surname: formData.surname,
          cuit: formData.cuit,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        });
        console.log('Respuesta de registro:', response); // Log de respuesta
        setSuccess('Registro exitoso! Ahora puedes iniciar sesión.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error); // Log de error
      setError('Error en la solicitud: ' + (error.response?.data?.message || 'Inténtalo de nuevo.'));
    }
  };

  const setToken = (token) => {
    Cookies.set('token', token, {
      expires: 7, // Expira en 7 días
      sameSite: 'None', // Permitir el uso en contextos de terceros
      secure: true // Asegúrate de que la cookie solo se envíe a través de HTTPS
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h2 className="text-2xl font-bold text-center mb-4">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        <div className="flex justify-around mb-4">
          <button
            className={`w-1/2 py-2 rounded ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={toggleForm}
          >
            Ingresar
          </button>
          <button
            className={`w-1/2 py-2 rounded ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={toggleForm}
          >
            Registrarse
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">Nombre</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="border rounded w-full py-2 px-3" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Apellido</label>
                <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="border rounded w-full py-2 px-3" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="border rounded w-full py-2 px-3" required />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="border rounded w-full py-2 px-3" required />
          </div>
          {isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700">CUIT</label>
              <input type="text" name="cuit" value={formData.cuit} onChange={handleChange} className="border rounded w-full py-2 px-3" required />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="border rounded w-full py-2 px-3" required />
          </div>
          <button type="submit" className="bg-blue-500 text-white rounded w-full py-2">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
