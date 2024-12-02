import api from './axiosConfig';

// Crear un movimiento
export const crearMovimiento = async (movimientoData) => {
  try {
    const response = await api.post('/movimientos/crear-movimiento', movimientoData);
    return response.data;
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    throw error;
  }
};

// Cambiar estado de un movimiento por ID
export const cambiarEstadoMovimiento = async (id) => {
  try {
    const response = await api.post(`/movimientos/cambiar-estado/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al cambiar estado del movimiento:', error);
    throw error;
  }
};

// Obtener un movimiento por ID
export const obtenerMovimientoPorId = async (id) => {
  try {
    const response = await api.get(`/movimientos/ver/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener movimiento por ID:', error);
    throw error;
  }
};

// Obtener todos los movimientos (versión detallada)
export const obtenerTodosMovimientos = async () => {
  try {
    const response = await api.get('/movimientos/ver-todos');
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los movimientos:', error);
    throw error;
  }
};
   