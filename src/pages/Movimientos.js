import React, { useEffect, useState } from 'react';
import { crearMovimiento, cambiarEstadoMovimiento, obtenerTodosMovimientos, obtenerMovimientoPorId } from '../api/movimientos.js';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState(null);

  // Estado para el movimiento seleccionado
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);

  // Estados para el formulario
  const [importe, setImporte] = useState('');
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [comentario, setComentario] = useState('');
  const [cuentaId, setCuentaId] = useState('');

  // Cargar movimientos al montar el componente
  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const data = await obtenerTodosMovimientos();
        setMovimientos(data);
      } catch (error) {
        setError('Error al obtener los movimientos:', error);
        console.error(error);
      }
    };

    fetchMovimientos();
  }, []);

  // Manejar envío del formulario para crear un movimiento
  const handleSubmit = async (e) => {
    e.preventDefault();

    const movimientoData = {
      importeMovimiento: parseFloat(importe),
      medioPago: medioPago,
      comentarioMovimiento: comentario,
      cuentaId: cuentaId,
    };

    try {
      await crearMovimiento(movimientoData);
      const data = await obtenerTodosMovimientos();
      setMovimientos(data);
      setImporte('');
      setMedioPago('EFECTIVO');
      setComentario('');
      setCuentaId('');
    } catch (error) {
      setError('Error al crear el movimiento', error.message);
      console.error(error);
    }
  };

  // Función para cambiar el estado de un movimiento
  const handleChangeEstado = async (id) => {
    try {
      await cambiarEstadoMovimiento(id);
      const data = await obtenerTodosMovimientos();
      setMovimientos(data);
    } catch (error) {
      setError("Error al actualizar el estado del movimiento");
      console.error(error);
    }
  };

  // Función para obtener un movimiento por su ID y mostrarlo en el modal
  const handleVerMovimiento = async (id) => {
    try {
      const data = await obtenerMovimientoPorId(id);
      setMovimientoSeleccionado(data);
    } catch (error) {
      setError('Error al obtener los detalles del movimiento');
      console.error(error);
    }
  };

  // Filtrar los movimientos activos y dados de baja
  const movimientosAlta = movimientos.filter((movimiento) => movimiento.isValid);
  const movimientosBaja = movimientos.filter((movimiento) => !movimiento.isValid);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Página de Movimientos</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Formulario para crear un movimiento */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Crear un Movimiento</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Formulario de campos */}
            <div>
              <label htmlFor="importe" className="block font-medium">Importe:</label>
              <input
                type="number"
                id="importe"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="medioPago" className="block font-medium">Medio de Pago:</label>
              <select
                id="medioPago"
                value={medioPago}
                onChange={(e) => setMedioPago(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="TARJETA_DEBITO">Tarjeta</option>
                <option value="CHEQUE">Cheque</option>
                <option value="CHEQUE_DIFERIDO">Cheque diferido</option>
                <option value="PAGARE">Pagaré</option>
              </select>
            </div>

            <div>
              <label htmlFor="comentario" className="block font-medium">Comentario:</label>
              <input
                type="text"
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="cuentaId" className="block font-medium">Cuenta ID:</label>
              <input
                type="text"
                id="cuentaId"
                value={cuentaId}
                onChange={(e) => setCuentaId(e.target.value)}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div className="mt-4 text-center">
              <button type="submit" className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600">
                Crear Movimiento
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Tabla de Movimientos Activos */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Movimientos Activos</h2>
        {movimientosAlta.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Comentario</th>
                <th className="px-4 py-2">Importe</th>
                <th className="px-4 py-2">Medio de Pago</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientosAlta.map((movimiento) => (
                <tr key={movimiento.id} className="border-t">
                  <td className="px-4 py-2">{movimiento.comentarioMovimiento}</td>
                  <td className="px-4 py-2">${movimiento.importeMovimiento}</td>
                  <td className="px-4 py-2">{movimiento.medioPago}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleChangeEstado(movimiento.id, 'baja')}
                      className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                    >
                      Baja
                    </button>
                    <button
                      onClick={() => handleVerMovimiento(movimiento.id)}
                      className="bg-blue-500 text-white py-1 px-4 rounded-md ml-2 hover:bg-blue-600"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No hay movimientos activos.</p>
        )}
      </div>

      {/* Modal para mostrar los detalles del movimiento */}
      {movimientoSeleccionado && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-semibold mb-4">Detalles del Movimiento</h2>
            <p><strong>Importe:</strong> ${movimientoSeleccionado.importeMovimiento}</p>
            <p><strong>Medio de Pago:</strong> {movimientoSeleccionado.medioPago}</p>
            <p><strong>Comentario:</strong> {movimientoSeleccionado.comentarioMovimiento}</p>
            <p><strong>Fecha Alta:</strong> {new Date(movimientoSeleccionado.fechaAltaMovimiento).toLocaleDateString()}</p>
            <p><strong>Comprobantes:</strong> {movimientoSeleccionado.comprobantes}</p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setMovimientoSeleccionado(null)}
                className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movimientos de Baja */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Movimientos Dados de Baja</h2>
        {movimientosBaja.length > 0 ? (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Comentario</th>
                <th className="px-4 py-2">Importe</th>
                <th className="px-4 py-2">Medio de Pago</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientosBaja.map((movimiento) => (
                <tr key={movimiento.id} className="border-t">
                  <td className="px-4 py-2">{movimiento.comentarioMovimiento}</td>
                  <td className="px-4 py-2">${movimiento.importeMovimiento}</td>
                  <td className="px-4 py-2">{movimiento.medioPago}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleChangeEstado(movimiento.id, 'alta')}
                      className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600"
                    >
                      Alta
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No hay movimientos dados de baja.</p>
        )}
      </div>
    </div>
  );
}

export default Movimientos;
