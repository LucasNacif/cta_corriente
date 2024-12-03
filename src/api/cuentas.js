import api from './axiosConfig';

export const crearCuenta = async (data) => {
    try {
        const response = await api.post('/cuentas/crear-cuenta', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Cuenta creada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al crear la cuenta:', error.response?.data || error.message);
    }
}

export const cambiarEstadoCuenta = async (idCuenta) => {
    try {
        const response = await api.post(`/cuentas/cambiar-estado/${idCuenta}`);
        console.log('Estado de la cuenta actualizado:', response.data);
        return response.data; 
    } catch (error) {
        console.error('Error al cambiar el estado de la cuenta:', error.response?.data || error.message);
        throw error;
    }
};

export const verCuentas = async () => {
    try {
        const response = await api.get('/cuentas/ver-cuentas');
        console.log(response)
        return response.data; 
    } catch (error) {
        console.error('Error al obtener las cuentas:', error.response?.data || error.message);
        throw error; 
    }
};

export const verCuentaPorId = async (id) => {
    try {
        const response = await api.get(`/cuentas/ver-cuenta-id/${id}`);
        console.log('Cuenta:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error al obtener la cuenta por ID:', error.response?.data || error.message);
    }
}






