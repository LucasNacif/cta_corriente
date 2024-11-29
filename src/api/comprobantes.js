import axios from 'axios';
import Cookies from 'cookies';

const apiComprobantes = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://cuentacorrienteproveedores.up.railway.app/api/comprobantes',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiComprobantes.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error.response || error.message);
    return Promise.reject(error);
  }
);


export const userApi = {
  getAll: async () => {
    const response = await apiComprobantes.get('/mostrar'); 
    return response.data;
  },

  getById: async (id) => {
    const response = await apiComprobantes.get(`/mostrar-id/${id}`); 
    return response.data;
  },

  getByNroComprobante: async (nroComprobante) => {
    const response = await apiComprobantes.get(`/mostrar-comprobante/${nroComprobante}`); 
    return response.data;
  },

  save: async (id, userData) => {
    const response = await apiComprobantes.post('/guardar', userData);
    return response.data;
  },

  changeState: async (id) => {
    const response = await apiComprobantes.post(`/cambiar-estado/${id}`); 
    return response.data;
  },
};



export default apiComprobantes;
