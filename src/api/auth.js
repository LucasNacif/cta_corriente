import api from './axiosConfig'

export const comprobanteApi = {

    // Metodo de Login
    register: async (userData) => {
        const response = await api.post('/autenticacion/registro', userData);
        return response.data;

    },
    // Crear un comprobante
    login: async (userData) => {
        const response = await api.post('/autenticacion/inicio-sesion', userData);
        return response.data;
    },

}