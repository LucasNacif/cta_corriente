import React, { useEffect, useState } from 'react';
import { verCuentas } from '../api/cuentas.js';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';
import Select from '../components/Select';
import Card from '../components/Card';
import { Plus, Users, X, Eye, EyeClosed, Search, ArrowBigRight, ArrowBigLeft } from 'lucide-react';
import { crearMovimiento, cambiarEstadoMovimiento, obtenerTodosMovimientos, obtenerMovimientoPorId, actualizarMovimiento } from '../api/movimientos.js';
import { comprobanteApi } from '../api/comprobantes.js';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [movimientosBaja, setMovimientosBaja] = useState([]);
  const [pageActivos, setPageActivos] = useState(1);
  const [pageBaja, setPageBaja] = useState(1);
  const [cuentas, setCuentas] = useState([]);
  const [error, setError] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isFormModalComp, setIsFormModalOpenComp] = useState(false);

  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState(null);

  const [numeroMovimiento, setnumeroMovimiento] = useState(0);
  const [importeMovimiento, setImporte] = useState(0);
  const [medioPago, setMedioPago] = useState('EFECTIVO');
  const [comentarioMovimiento, setComentario] = useState('');
  const [cuentaId, setCuentaId] = useState('');

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

        const cuentasData = await verCuentas();
        if (Array.isArray(cuentasData) && cuentasData.length > 0) {
          setCuentas(cuentasData);
          setCuentaId(cuentasData[0].id);
        } else {
          setCuentas([]);
          setError('No se encontraron cuentas disponibles.');
        }

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
  // Lógica de paginación de movimientos activos
  const movimientosActivosPaginados = movimientos.slice((pageActivos - 1) * itemsPerPage, pageActivos * itemsPerPage);
  // Lógica de paginación de movimientos de baja
  const movimientosBajaPaginados = movimientosBaja.slice((pageBaja - 1) * itemsPerPage, pageBaja * itemsPerPage);

  // Total de páginas para movimientos activos
  const totalPagesActivos = Math.ceil(movimientos.length / itemsPerPage);
  // Total de páginas para movimientos de baja
  const totalPagesBaja = Math.ceil(movimientosBaja.length / itemsPerPage);

  // Funciones de navegación de páginas para movimientos activos
  const handleNextPageActivos = () => {
    if (pageActivos < totalPagesActivos) {
      setPageActivos(pageActivos + 1);
    }
  };

  const handlePreviousPageActivos = () => {
    if (pageActivos > 1) {
      setPageActivos(pageActivos - 1);
    }
  };

  // Funciones de navegación de páginas para movimientos de baja
  const handleNextPageBaja = () => {
    if (pageBaja < totalPagesBaja) {
      setPageBaja(pageBaja + 1);
    }
  };

  const handlePreviousPageBaja = () => {
    if (pageBaja > 1) {
      setPageBaja(pageBaja - 1);
    }
  };


  const columnas = [
    { header: 'N°', align: 'text-left' },
    { header: 'Comentario', align: 'text-center' },
    { header: 'Importe', align: 'text-center' },
    { header: 'Entregado', align: 'text-center' },
    { header: 'Medio de Pago', align: 'text-center' },
    { header: 'Acciones', align: 'text-end' },
  ];

  const renderRow = (movimiento, tipo) => (
    <>
      <td className="px-4 py-3">{movimiento.numeroMovimiento}</td>
      <td className="px-4 py-3">{movimiento.comentarioMovimiento}</td>
      <td className="px-4 py-3 text-center">${movimiento.importeMovimiento}</td>
      <td className="px-4 py-3 text-center">${movimiento.importePagado}</td>
      <td className="px-4 py-3 text-center">{movimiento.medioPago
        .toLowerCase()
        .replace(/_/g, " ")
        .split(" ")
        .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(" ")}</td>
      <td className="px-4 py-3 flex space-x-2 justify-end">
        <Button icon={Search} label="Ver" onClick={() => handleVerMovimiento(movimiento.id)} color="neutral2" />

        {tipo === 'activo' ? (
          <>
            <Button icon={Plus} label="Comprobante" color="blue" onClick={() => {
              setMovimientoSeleccionado(movimiento);
              setIsFormModalOpenComp(true);
            }} />
            <Button icon={EyeClosed} label="Baja" onClick={() => handleCambiarEstado(movimiento.id, 'baja')} color="red" />
          </>
        ) : (
          <Button icon={Eye} label="Alta" onClick={() => handleCambiarEstado(movimiento.id, 'alta')} color="green" />
        )}
      </td>
    </>
  );


  const handleAñadirComprobante = async (e) => {

    e.preventDefault();
    setErrorModal(null);

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

      const nuevoComprobante = {
        tipoComprobante,
        descripcion: descripcionComprobante,
        nroComprobante,
        fechaComprobante,
        montoComprobante: parseFloat(montoComprobante),
        movimientoId: movimientoSeleccionado.id,
      };

      // Enviar el comprobante al backend
      const responseComp = await comprobanteApi.save(nuevoComprobante);

      if (!responseComp || responseComp.error) {
        setErrorModal('Error al añadir un comprobante: ' + responseComp?.message || 'No hubo respuesta');
        return;
      }

      // Actualizar el movimiento en el backend
      const movimientoResponse = await actualizarMovimiento(movimientoSeleccionado.id, parseFloat(montoComprobante));
      if (!movimientoResponse) {
        setErrorModal('Error al actualizar el movimiento.');
        return;
      }

      //si todo salio ok, se cierra el modal y se limpia to
      setIsFormModalOpenComp(false);
      setMontoComprobante(0);
      setDescripcionComprobante('');
      setFechaComprobante('');

      const data = await obtenerTodosMovimientos();
      setMovimientos(data.filter((mov) => mov.isValid));
      setMovimientosBaja(data.filter((mov) => !mov.isValid));

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

      {/* Movimientos Activos */}
      <p className="font-normal text-sm mt-4 pb-2">Movimientos Activos</p>
      <Table columns={columnas} data={movimientosActivosPaginados} renderRow={(mov) => renderRow(mov, 'activo')} />
      {/* Paginación de movimientos activos */}
      <div className="flex justify-end mt-4">
        <Button
          icon={ArrowBigLeft}
          color="neutral2"
          onClick={handlePreviousPageActivos}
          disabled={pageActivos === 1}
        />
        <span className="mx-7 flex items-center text-sm font-extralight">Página {pageActivos} de {totalPagesActivos}</span>
        <Button
          icon={ArrowBigRight}
          color="neutral2"
          onClick={handleNextPageActivos}
          disabled={pageActivos === totalPagesActivos}
        />
      </div>

      {/* Movimientos de Baja */}
      <p className="font-normal text-sm pb-2 mt-6">Movimientos de Baja</p>
      <Table columns={columnas} data={movimientosBajaPaginados} renderRow={(mov) => renderRow(mov, 'baja')} />
      {/* Paginación de movimientos de baja */}
      <div className="flex justify-end mt-4">
        <Button
          icon={ArrowBigLeft}
          color="neutral2"
          onClick={handlePreviousPageBaja}
          disabled={pageBaja === 1}
        />
        <span className="mx-7 flex items-center text-sm font-extralight">Página {pageBaja} de {totalPagesBaja}</span>
        <Button
          icon={ArrowBigRight}
          color="neutral2"
          onClick={handleNextPageBaja}
          disabled={pageBaja === totalPagesBaja}
        />
      </div>

      {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle Movimiento" icon={Users}>
        {movimientoSeleccionado ? (
          <div>
            <p><strong>Comentario:</strong> {movimientoSeleccionado.comentarioMovimiento}</p>
            <p><strong>Importe:</strong> ${movimientoSeleccionado.importeMovimiento}</p>
            <p><strong>Medio de Pago:</strong> {movimientoSeleccionado.medioPago
              .toLowerCase()
              .replace(/_/g, " ")
              .split(" ")
              .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
              .join(" ")}</p>
            <p><strong>Comprobante:</strong>{movimientoSeleccionado.comprobantes}</p>
          </div>
        ) : (
          <p>No hay información disponible para este movimiento.</p>
        )}
      </Modal> */}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle Movimiento" label="Resumen del Movimiento" className="md:w-1/2">
        {movimientoSeleccionado && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-md font-semibold text-gray-800">Número de Movimiento:</p>
                <p className="text-sm text-gray-600">{movimientoSeleccionado.numeroMovimiento}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-800">Importe Movimiento:</p>
                <p className="text-sm text-gray-600">${movimientoSeleccionado.importeMovimiento}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-800">Importe Pagado:</p>
                <p className="text-sm text-gray-600">${movimientoSeleccionado.importePagado}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-800">Medio de Pago:</p>
                <p className="text-sm text-gray-600">{movimientoSeleccionado.medioPago}</p>
              </div>
              <div className="col-span-2">
                <p className="text-md font-semibold text-gray-800">Comentario:</p>
                <p className="text-sm text-gray-600">{movimientoSeleccionado.comentarioMovimiento}</p>
              </div>
              <div className="col-span-2">
                <p className="text-md font-semibold text-gray-800">Fecha de Alta:</p>
                <p className="text-sm text-gray-600">{new Date(movimientoSeleccionado.fechaAltaMovimiento).toLocaleString()}</p>
              </div>
            </div>

            <h3 className="mt-6 text-lg font-medium text-gray-900">Comprobantes:</h3>
            <Card className="max-h-60 overflow-y-auto border-zinc-400 p-4">
              {movimientoSeleccionado.comprobantes.length > 0 ? (
                movimientoSeleccionado.comprobantes.map((comprobante) => (
                  <div key={comprobante.id} className="pb-2 border-b border-zinc-400">
                    <p className="text-sm font-medium text-gray-700">
                      <span className="font-semibold">Tipo:</span> {comprobante.tipoComprobante}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      <span className="font-semibold">Descripción:</span> {comprobante.descripcion}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      <span className="font-semibold">Monto:</span> ${comprobante.montoComprobante}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      <span className="font-semibold">Número:</span> {comprobante.nroComprobante}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      <span className="font-semibold">Fecha del Comprobante:</span> {new Date(comprobante.fechaComprobante).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm font-medium text-zinc-700">No hay comprobantes registrados.</p>
              )}
            </Card>
          </div>
        )}
      </Modal>



      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Nuevo Movimiento" icon={Users}>
        <form onSubmit={handleCrearMovimiento} className='space-y-3'>
          <Input label="Importe" type="number" value={importeMovimiento} onChange={(e) => setImporte(e.target.value)} required />
          <Select label="Medio de Pago" options={mediosPagoOptions} value={medioPago} onChange={(e) => setMedioPago(e.target.value)} required />
          <Input label="Comentario" type="text" value={comentarioMovimiento} onChange={(e) => setComentario(e.target.value)} required />

          <Select
            label="Cuenta"
            options={cuentas && cuentas.length > 0 ? cuentas.map((cuenta) => ({ value: cuenta.id, label: cuenta.nombreProveedor })) : []}
            value={cuentaId}
            onChange={(e) => setCuentaId(e.target.value)}
            required
          />
          <Button className="mt-3" label="Guardar" type="submit" color="green" />
        </form>
      </Modal>

      <Modal isOpen={isFormModalComp} onClose={() => setIsFormModalOpenComp(false)} title="Nuevo Comprobante" icon={Plus}>
        {errorModal &&
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-monza-700/80 text-monza-200 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4">
              <p className="text-sm">{errorModal}</p>
              <button
                className="ml-auto flex items-center justify-center Ztext-white hover:bg-red-800 rounded-full px-1"
                onClick={() => setErrorModal(null)}
              >
                <X className='w-4' />
              </button>
            </div>
          </div>
        }
        <form onSubmit={handleAñadirComprobante}>
          <Select label="Tipo de Comprobante" options={tipoComprobanteOptions} value={tipoComprobante} onChange={(e) => setTipoComprobante(e.target.value)} />
          <Input label="Monto" type="number" value={montoComprobante} onChange={(e) => setMontoComprobante(e.target.value)} />
          <Input label="Descripción" type="text" value={descripcionComprobante} onChange={(e) => setDescripcionComprobante(e.target.value)} />
          <Input label="Fecha" type="date" value={fechaComprobante} onChange={(e) => setFechaComprobante(e.target.value)} />
          <Input label="Número de Comprobante" type="text" value={nroComprobante} onChange={(e) => setNumeroComprobante(e.target.value)} />
          <Button className="mt-3" label="Añadir Comprobante" type="submit" color="green" />
        </form>
      </Modal>

    </div>
  );
}
export default Movimientos;
