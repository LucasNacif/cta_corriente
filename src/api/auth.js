import api from './axiosConfig'

export const LoginApi = {

    // Metodo de Login
    register: async (userData) => {
        const response = await api.post('/autenticacion/registro', userData);
        return response.data;

    },
    // Crear un Usuario
    login: async (userData) => {
        const response = await api.post('/autenticacion/inicio-sesion', userData);
        return response.data;
    },

}