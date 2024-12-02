import React, { useEffect, useState } from 'react';
import { crearMovimiento, cambiarEstadoMovimiento, obtenerTodosMovimientos, obtenerMovimientoPorId } from '../api/movimientos.js';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';
import Select from '../components/Select';
import { Plus, Users } from 'lucide-react';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosBaja, setMovimientosBaja] = useState([]);
  const [error, setError] = useState(null);

  // Estados para modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);

  // Estados para el formulario
  const [importe, setImporte] = useState('');
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [comentario, setComentario] = useState('');
  const [cuentaId, setCuentaId] = useState('');

  // Opciones del select
  const mediosPagoOptions = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
    { value: 'TARJETA_DEBITO', label: 'Tarjeta Débito' },
    { value: 'CHEQUE', label: 'Cheque' },
    { value: 'CHEQUE_DIFERIDO', label: 'Cheque Diferido' },
    { value: 'PAGARE', label: 'Pagaré' },
  ];

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const data = await obtenerTodosMovimientos();
        setMovimientos(data.filter((mov) => mov.isValid)); // Movimientos activos
        setMovimientosBaja(data.filter((mov) => !mov.isValid)); // Movimientos de baja
      } catch (error) {
        setError('Error al obtener los movimientos');
        console.error(error);
      }
    };
    fetchMovimientos();
  }, []);

  const handleCrearMovimiento = async (e) => {
    e.preventDefault();
    try {
      await crearMovimiento({ importe, medioPago, comentario, cuentaId });
      const data = await obtenerTodosMovimientos();
      setMovimientos(data.filter((mov) => mov.isValid));
      setMovimientosBaja(data.filter((mov) => !mov.isValid));
      setIsFormModalOpen(false);
      setImporte('');
      setMedioPago('EFECTIVO');
      setComentario('');
      setCuentaId('');
    } catch (error) {
      setError('Error al crear el movimiento');
      console.error(error);
    }
  };

  const handleVerMovimiento = async (id) => {
    try {
      const movimiento = await obtenerMovimientoPorId(id);
      setMovimientoSeleccionado(movimiento);
      setIsModalOpen(true);
    } catch (error) {
      setError('Error al obtener el movimiento');
      console.error(error);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoMovimiento(id, nuevoEstado);
      const data = await obtenerTodosMovimientos();
      setMovimientos(data.filter((mov) => mov.isValid));
      setMovimientosBaja(data.filter((mov) => !mov.isValid));
    } catch (error) {
      setError('Error al cambiar el estado');
      console.error(error);
    }
  };

  const columnas = [
    { header: 'Comentario', align: 'text-left' },
    { header: 'Importe', align: 'text-center' },
    { header: 'Medio de Pago', align: 'text-center' },
    { header: 'Acciones', align: 'text-end' },
  ];

  const renderRow = (movimiento, tipo) => (
    <>
      <td className="px-4 py-3">{movimiento.comentarioMovimiento}</td>
      <td className="px-4 py-3 text-center">${movimiento.importeMovimiento}</td>
      <td className="px-4 py-3 text-center">{movimiento.medioPago}</td>
      <td className="px-4 py-3 flex space-x-2 justify-end">
        <Button label="Ver" onClick={() => handleVerMovimiento(movimiento.id)} color="neutral" />
        {tipo === 'activo' ? (
          <Button label="Baja" onClick={() => handleCambiarEstado(movimiento.id, 'baja')} color="red" />
        ) : (
          <Button label="Alta" onClick={() => handleCambiarEstado(movimiento.id, 'alta')} color="green" />
        )}
      </td>
    </>
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Movimientos</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <Button label="Crear Movimiento" icon={Plus} onClick={() => setIsFormModalOpen(true)} color="green" />

      {/* Tabla de Movimientos Activos */}
      <p className="font-normal text-sm mt-4 pb-2">Movimientos Activos</p>
      <Table columns={columnas} data={movimientos} renderRow={(mov) => renderRow(mov, 'activo')} />

      {/* Tabla de Movimientos de Baja */}
      <p className="font-normal text-sm pb-2 mt-6">Movimientos de Baja</p>
      <Table columns={columnas} data={movimientosBaja} renderRow={(mov) => renderRow(mov, 'baja')} />

      {/* Modal de Detalle */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle Movimiento" icon={Users}>
        {movimientoSeleccionado && (
          <div>
            <p><strong>Comentario:</strong> {movimientoSeleccionado.comentarioMovimiento}</p>
            <p><strong>Importe:</strong> ${movimientoSeleccionado.importeMovimiento}</p>
            <p><strong>Medio de Pago:</strong> {movimientoSeleccionado.medioPago}</p>
          </div>
        )}
      </Modal>

      {/* Modal de Nuevo Movimiento */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Nuevo Movimiento" icon={Users}>
        <form onSubmit={handleCrearMovimiento}>
          <Input label="Importe" type="number" value={importe} onChange={(e) => setImporte(e.target.value)} />
          <Select label="Medio de Pago" options={mediosPagoOptions} value={medioPago} onChange={(e) => setMedioPago(e.target.value)} />
          <Input label="Comentario" type="text" value={comentario} onChange={(e) => setComentario(e.target.value)} />
          <Input label="Cuenta ID" type="text" value={cuentaId} onChange={(e) => setCuentaId(e.target.value)} />
          <Button label="Guardar" type="submit" color="green" />
        </form>
      </Modal>
    </div>
  );
}

export default Movimientos;
