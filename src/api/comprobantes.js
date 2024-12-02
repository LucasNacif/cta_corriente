import api from './axiosConfig'

// Mostrar todos lo comprobantes
export const comprobanteApi = {
    getAll: async () => {
        const response = await api.get('/api/comprobantes/mostrar');
        return response.data;
    },

    // Mostrar comprobantes por id
    getById: async (id) => {
        const response = await api.get(`/api/comprobantes/mostrar-id/${id}`);
        return response.data;
    },

    // Mostrar movimiento por numero de comprobante
    getByNroComprobante: async (nroComprobante) => {
        const response = await api.get(`/api/comprobantes/mostrar-comprobante/${nroComprobante}`);
        return response.data;
    },

    // Crear un comprobante
    save: async (id, userData) => {
        const response = await api.post('/api/comprobantes/guardar', userData);
        return response.data;
    },

    // Cambiarle el estado a un comprobante
    changeState: async (id) => {
        const response = await api.post(`/api/comprobantes/cambiar-estado/${id}`);
        return response.data;
    },
};
