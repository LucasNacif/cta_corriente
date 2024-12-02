import React, { useEffect, useState } from 'react';
import { crearMovimiento, cambiarEstadoMovimiento, obtenerTodosMovimientos, obtenerMovimientoPorId } from '../api/movimientos.js';
import { verCuentas } from '../api/cuentas.js';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';
import Select from '../components/Select';
import { Plus, Users } from 'lucide-react';
import ComprobanteManager from '../components/ComprobanteManager'; 

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosBaja, setMovimientosBaja] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);
  const [isComprobanteModalOpen, setIsComprobanteModalOpen] = useState(false);
  const [selectedMovimientoForComprobante, setSelectedMovimientoForComprobante] = useState(null);

  const [importeMovimiento, setImporte] = useState(0);
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [comentarioMovimiento, setComentario] = useState('');
  const [cuentaId, setCuentaId] = useState('');

  const [page, setPage] = useState(1); 
  const [itemsPerPage] = useState(3); 

  const mediosPagoOptions = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TRANSFERENCIA_BANCARIA', label: 'Transferencia' },
    { value: 'TARJETA_DEBITO', label: 'Tarjeta Débito' },
    { value: 'CHEQUE_CORRIENTE', label: 'Cheque' },
    { value: 'CHEQUE_DIFERIDO', label: 'Cheque Diferido' },
    { value: 'PAGARE', label: 'Pagaré' },
  ];

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const data = await obtenerTodosMovimientos();

        //obtengo las cuentas tambien para el select
        const cuentasData = await verCuentas();
        setCuentas(cuentasData);

        if (data.length) {
          setMovimientos(data.filter((mov) => mov.isValid));
          setMovimientosBaja(data.filter((mov) => !mov.isValid));
        } else {
          setError('No se encontraron movimientos.');
        }
      } catch (error) {
        setError('Error al obtener los movimientos.');
        console.error(error);
      }
    };
    fetchMovimientos();
  }, []);

  const handleCrearMovimiento = async (e) => {
    e.preventDefault();
    if (!importeMovimiento || !cuentaId) {
      setError('Debe completar todos los campos requeridos.');
      return;
    }
    try {
      const response = await crearMovimiento({ importeMovimiento, medioPago, comentarioMovimiento, cuentaId });
      console.log(response)
      if (response) {
        const data = await obtenerTodosMovimientos();
        setMovimientos(data.filter((mov) => mov.isValid));
        setMovimientosBaja(data.filter((mov) => !mov.isValid));
        setIsFormModalOpen(false);
        setImporte(0);
        setMedioPago('EFECTIVO');
        setComentario('');
        setCuentaId('');
      } else {
        setError('No se pudo crear el movimiento.');
      }
    } catch (error) {
      setError('Error al crear el movimiento.');
      console.error(error);
    }
  };

  const handleVerMovimiento = async (id) => {
    try {
      const movimiento = await obtenerMovimientoPorId(id);
      if (movimiento) {
        setMovimientoSeleccionado(movimiento);
        setIsModalOpen(true);
      } else {
        setError('Movimiento no encontrado.');
      }
    } catch (error) {
      setError('Error al obtener el movimiento.');
      console.error(error);
    }
  };

  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      const response = await cambiarEstadoMovimiento(id, nuevoEstado);
      if (response) {
        const data = await obtenerTodosMovimientos();
        setMovimientos(data.filter((mov) => mov.isValid));
        setMovimientosBaja(data.filter((mov) => !mov.isValid));
      } else {
        setError('No se pudo cambiar el estado del movimiento.');
      }
    } catch (error) {
      setError('Error al cambiar el estado del movimiento.');
      console.error(error);
    }
  };

   // Paginación para movimientos activos
   const movimientosActivosPaginados = movimientos.slice((page - 1) * itemsPerPage, page * itemsPerPage);
   const movimientosBajaPaginados = movimientosBaja.slice((page - 1) * itemsPerPage, page * itemsPerPage);

   
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
          //aca metele el onclick pa abrir el modal
           <>
            <Button
              label="Añadir Comprobante"
              color="blue"
              onClick={() => {
                setSelectedMovimientoForComprobante(movimiento.id);
                setIsComprobanteModalOpen(true);
              }}
            />
           <Button label="Baja" onClick={() => handleCambiarEstado(movimiento.id, 'baja')} color="red" /></>
        ) : (
          <Button label="Alta" onClick={() => handleCambiarEstado(movimiento.id, 'alta')} color="green" />
        )}
      </td>
    </>
  );
    // Funciones para navegación de páginas
    const handleNextPage = () => {
      setPage(page + 1);
    };
  
    const handlePreviousPage = () => {
      if(page > 1){
        setPage(page - 1);
      }
    };


    return (
      <div className="p-4">
        <h1 className="text-3xl font-bold text-center mb-6">Movimientos</h1>
  
        {error && <p className="text-red-500 text-center">{error}</p>}
  
        <Button label="Crear Movimiento" icon={Plus} onClick={() => setIsFormModalOpen(true)} color="green" />
  
        <p className="font-normal text-sm mt-4 pb-2">Movimientos Activos</p>
        <Table columns={columnas} data={movimientosActivosPaginados} renderRow={(mov) => renderRow(mov, 'activo')} />
  
        <p className="font-normal text-sm pb-2 mt-6">Movimientos de Baja</p>
        <Table columns={columnas} data={movimientosBajaPaginados} renderRow={(mov) => renderRow(mov, 'baja')} />
  
        {/* Paginación */}
        <div className="flex justify-between mt-4">
          <Button label="Anterior" onClick={handlePreviousPage} disabled={page === 1} color="neutral" />
          <span className="px-4 text-sm text-gray-600">Página {page}</span>
          <Button label="Siguiente" onClick={handleNextPage} disabled={movimientos.length <= page * itemsPerPage} color="neutral" />
        </div>
  
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle Movimiento" icon={Users}>
          {movimientoSeleccionado ? (
            <div>
              <p><strong>Comentario:</strong> {movimientoSeleccionado.comentarioMovimiento}</p>
              <p><strong>Importe:</strong> ${movimientoSeleccionado.importeMovimiento}</p>
              <p><strong>Medio de Pago:</strong> {movimientoSeleccionado.medioPago}</p>
            </div>
          ) : (
            <p>No hay información disponible para este movimiento.</p>
          )}
        </Modal>

        {selectedMovimientoForComprobante && (
          <Modal
            isOpen={isComprobanteModalOpen}
            onClose={() => setIsComprobanteModalOpen(false)}
            title="Añadir Comprobante"
            icon={Users}
          >
            <ComprobanteManager
              movimientoId={selectedMovimientoForComprobante}
              onClose={() => setIsComprobanteModalOpen(false)}
              onSuccess={() => {
                // Add any success handling logic
              }}
            />
          </Modal>
        )}
  
        <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Nuevo Movimiento" icon={Users}>
        <form onSubmit={handleCrearMovimiento}>
          <Input label="Importe" type="number" value={importeMovimiento} onChange={(e) => setImporte(e.target.value)} />
          <Select label="Medio de Pago" options={mediosPagoOptions} value={medioPago} onChange={(e) => setMedioPago(e.target.value)} />
          <Input label="Comentario" type="text" value={comentarioMovimiento} onChange={(e) => setComentario(e.target.value)} />
          <Select
            label="Cuenta"
            options={cuentas && cuentas.length > 0 ? cuentas.map((cuenta) => ({
              value: cuenta.id,
              label: cuenta.nombreProveedor
            })) : []}
            value={cuentaId}
            onChange={(e) => setCuentaId(e.target.value)}
          />
          <Button className="mt-3" label="Guardar" type="submit" color="green" />
        </form>
      </Modal>
      </div>
    );
  }
export default Movimientos;
