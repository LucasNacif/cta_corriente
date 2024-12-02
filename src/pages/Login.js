'use client'

import { useState } from 'react'
import LoginForm from '../components/login/LoginForm'
import RegisterForm from '../components/login/RegisterForm'
import Footer from '../components/login/footer'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      <div className="text-center mb-6">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-20 h-20 mx-auto"
        />
        <h1 className="text-2xl font-bold text-white mt-3">Piezas Ya</h1>
      </div>

      <div className="w-full max-w-sm">
        <div className="bg-gray-100 rounded-xl shadow-md p-6 mb-6 border border-gray-700 text-white">
          {/* Botones de Login y Register */}
          <div className="flex mb-4">
            <button
              className={`flex-1 py-2 text-center ${isLogin ? 'bg-gradient-to-br from-red-500 to-red-700 text-white' : 'bg-gray-700 text-gray-300'
                } rounded-tl-lg rounded-bl-lg font-semibold transition duration-300 text-sm`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 text-center ${!isLogin ? 'bg-gradient-to-br from-red-500 to-red-700 text-white' : 'bg-gray-700 text-gray-300'
                } rounded-tr-lg rounded-br-lg font-semibold transition duration-300 text-sm`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {/* Formularios */}
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
        <Footer />
      </div>
    </div>
  );
}
