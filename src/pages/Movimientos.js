import React, { useEffect, useState } from 'react';
import { verCuentas } from '../api/cuentas.js';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';
import Select from '../components/Select';
import { Plus, Users, X } from 'lucide-react';
import { crearMovimiento, cambiarEstadoMovimiento, obtenerTodosMovimientos, obtenerMovimientoPorId, actualizarMovimiento } from '../api/movimientos.js';
import { comprobanteApi } from '../api/comprobantes.js';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosBaja, setMovimientosBaja] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFormModalComp, setIsFormModalOpenComp] = useState(false);

  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);

  const [importeMovimiento, setImporte] = useState(0);
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [comentarioMovimiento, setComentario] = useState('');
  const [cuentaId, setCuentaId] = useState('');

  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(3);

  const [montoComprobante, setMontoComprobante] = useState(0);
  const [descripcionComprobante, setDescripcionComprobante] = useState('');
  const [fechaComprobante, setFechaComprobante] = useState('');
  const [tipoComprobante, setTipoComprobante] = useState('FACTURA');
  const [nroComprobante, setNumeroComprobante] = useState('');

  const tipoComprobanteOptions = [
    { value: 'FACTURA', label: 'Factura' },
    { value: 'NOTA_DEBITO', label: 'Nota de Débito' },
    { value: 'NOTA_CREDITO', label: 'Nota de Crédito' },
    { value: 'RECIBO', label: 'Recibo' },
    { value: 'REMITO', label: 'Remito' },
    { value: 'TICKET', label: 'Ticket' },
  ];

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
    { header: 'Entregado', align: 'text-center' },
    { header: 'Medio de Pago', align: 'text-center' },
    { header: 'Acciones', align: 'text-end' },
  ];

  const renderRow = (movimiento, tipo) => (
    <>
      <td className="px-4 py-3">{movimiento.comentarioMovimiento}</td>
      <td className="px-4 py-3 text-center">${movimiento.importeMovimiento}</td>
      <td className="px-4 py-3 text-center">${movimiento.importePagado}</td>
      <td className="px-4 py-3 text-center">{movimiento.medioPago}</td>
      <td className="px-4 py-3 flex space-x-2 justify-end">
        <Button label="Ver" onClick={() => handleVerMovimiento(movimiento.id)} color="neutral" />

        {tipo === 'activo' ? (
          <>
            <Button label="Añadir Comprobante" color="blue" onClick={() => {
              setMovimientoSeleccionado(movimiento);
              setIsFormModalOpenComp(true);
            }} />
            <Button label="Baja" onClick={() => handleCambiarEstado(movimiento.id, 'baja')} color="red" />
          </>
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
    if (page > 1) {
      setPage(page - 1);
    }
  };


  const handleAñadirComprobante = async () => {

    if (!montoComprobante || montoComprobante === 0 || !descripcionComprobante || !fechaComprobante) {
      setErrorModal('Debe completar todos los campos del comprobante.');
      return;
    }
    try {

      // Verificar que el importe del comprobante no supere el del movimiento
      const nuevoimportePagado = parseFloat(movimientoSeleccionado.importePagado) + parseFloat(montoComprobante);
      if (nuevoimportePagado > movimientoSeleccionado.importeMovimiento) {
        setErrorModal('El importe total de los comprobantes no puede superar el importe del movimiento.');
        return;
      }
      console.log("Importe total:", movimientoSeleccionado.importeMovimiento);
      console.log("Importe entregado:", movimientoSeleccionado.importePagado);
      console.log("Importe del comprobante a ingresar: ", montoComprobante);
      console.log("Suma del importe nuevo y el viejo: ", parseInt(nuevoimportePagado));
      console.log("Es mayor? ", nuevoimportePagado > movimientoSeleccionado.importeMovimiento);


      // Actualizar el movimiento en el backend
      const movimientoResponse = await actualizarMovimiento(movimientoSeleccionado.id, parseFloat(montoComprobante));

      console.log(movimientoResponse);

      if (movimientoResponse) {
        const nuevoComprobante = {
          tipoComprobante,
          descripcion: descripcionComprobante,
          nroComprobante,
          fechaComprobante,
          montoComprobante: parseFloat(montoComprobante),
          movimientoId: movimientoSeleccionado.id,
        };

        // Enviar el comprobante al backend
        const response = await comprobanteApi.save(nuevoComprobante);

        if (response) {
          setIsFormModalOpenComp(false);
          setMontoComprobante(0);
          setDescripcionComprobante('');
          setFechaComprobante('');
        }
      }
    } catch (error) {
      setErrorModal('Error al añadir el comprobante.');
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold text-center mb-2">Movimientos</h1>
        <div>
          <Button icon={Plus} label="Crear Movimiento" onClick={() => setIsFormModalOpen(true)} color="green" />
        </div>
      </div>
      {error &&
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-monza-700/80 text-monza-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">
            <p className="text-sm">{error}</p>
            <button
              className="ml-auto flex items-center justify-center Ztext-white hover:bg-red-800 rounded-full px-1"
              onClick={() => setError(null)}
            >
              <X className='w-4' />
            </button>
          </div>
        </div>
      }

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

      <Modal isOpen={isFormModalComp} onClose={() => setIsFormModalOpenComp(false)} title="Nuevo Comprobante" icon={Plus}>
      {errorModal && <p className="text-red-500 text-center">{errorModal}</p>}
        <form onSubmit={handleAñadirComprobante}>
          <Select label="Tipo de Comprobante" options={tipoComprobanteOptions} value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)} />
          <Input label="Monto" type="number" value={montoComprobante} onChange={(e) => setMontoComprobante(e.target.value)} />
          <Input label="Descripción" type="text" value={descripcionComprobante} onChange={(e) => setDescripcionComprobante(e.target.value)} />
          <Input label="Fecha" type="date" value={fechaComprobante} onChange={(e) => setFechaComprobante(e.target.value)} />
          <Input label="Número de Comprobante" type="text" value={nroComprobante} onChange={(e) => setNumeroComprobante(e.target.value)} />
          <Button label="Añadir Comprobante" type="submit" color="green" />
        </form>
      </Modal>

    </div>
  );
}
export default Movimientos;
