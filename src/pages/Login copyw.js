"use client";

import React, { useState, useEffect } from 'react';
import { LoginApi } from '../api/auth';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';



const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    cuit: '',
    phone: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (Cookies.get('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
        setToken(response);
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
        console.log('Respuesta de registro:', response);
        setSuccess('Registro exitoso! Ahora puedes iniciar sesión.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setError('Error en la solicitud: ' + (error.response?.data?.message || 'Inténtalo de nuevo.'));
    }
  };

  const setToken = (response) => {
    Cookies.set('token', response.token, {
      expires: 7,
      sameSite: 'None',
      secure: true
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-800 via-blue-600 to-blue-800">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <div className="text-center mb-4">
          <Logo />
        </div>
        <h2 className="text-2xl font-bold text-center text-red-600 mb-4">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        <div className="flex justify-around mb-4">
          <button
            className={`w-1/2 py-2 rounded ${isLogin ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'}`}
            onClick={toggleForm}
          >
            Ingresar
          </button>
          <button
            className={`w-1/2 py-2 rounded ${!isLogin ? 'bg-red-600 text-white' : 'bg-gray-200 text-black'}`}
            onClick={toggleForm}
          >
            Registrarse
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* Condicionalmente renderizar los campos para registro */}
          {!isLogin && (
            <>
              <FormInput
                label="Nombre"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Apellido"
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Teléfono"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </>
          )}
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <FormInput
            label="CUIT"
            type="text"
            name="cuit"
            value={formData.cuit}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="bg-red-600 text-white rounded w-full py-2">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
