import React, { useEffect, useState } from 'react';
import { verCuentas, verCuentaPorId, crearCuenta } from '../api/cuentas';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';

function Cuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Estados para crear una nueva cuenta
  const [nombreCuenta, setNombreCuenta] = useState('');
  const [nombreProveedor, setNombreProveedor] = useState('');
  const [numeroCelular, setNumeroCelular] = useState('');
  const [emailProveedor, setEmailProveedor] = useState('');
  const [direccionProveedor, setDireccionProveedor] = useState('');

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const data = await verCuentas();
        setCuentas(data);
      } catch (error) {
        setError('Error al obtener las cuentas');
      }
    };
    fetchCuentas();
  }, []);

  const handleVerCuenta = async (id) => {
    try {
      const cuenta = await verCuentaPorId(id);
      if (cuenta) {
        setCuentaSeleccionada(cuenta);
        setIsModalOpen(true);
      } else {
        setError('No se encontró la cuenta seleccionada');
      }
    } catch (error) {
      setError('Error al obtener los detalles de la cuenta');
    }
  };

  const handleCrearCuenta = async (e) => {
    e.preventDefault();
    try {
      await crearCuenta({
        name: nombreCuenta,
        nombreProveedor,
        numeroCelular,
        emailProveedor,
        direccionProveedor,
      });
      const data = await verCuentas();
      setCuentas(data);
      setIsFormModalOpen(false);
      setNombreCuenta('');
      setNombreProveedor('');
      setNumeroCelular('');
      setEmailProveedor('');
      setDireccionProveedor('');
    } catch (error) {
      setError('Error al crear la cuenta');
    }
  };

  const columnas = [
    { header: 'Nombre', align: 'text-left' },
    { header: 'Proveedor', align: 'text-left' },
    { header: 'Celular', align: 'text-center' },
    { header: 'Email', align: 'text-left' },
    { header: 'Dirección', align: 'text-left' },
    { header: 'Estado', align: 'text-center' },
    { header: 'Acciones', align: 'text-end' },
  ];


  const getEstadoColor = (estado) => {
    console.log("Estado recibido: ", estado);
    switch (estado) {
      case 'MOROSA':
        return 'red';
      case 'CANCELADA':
        return 'green';
      case 'PENDIENTE':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const renderRow = (cuenta) => (
    <>
      <td className="px-4 py-3">{cuenta.name}</td>
      <td className="px-4 py-3">{cuenta.nombreProveedor}</td>
      <td className="px-4 py-3 text-center">{cuenta.numeroCelular}</td>
      <td className="px-4 py-3">{cuenta.emailProveedor}</td>
      <td className="px-4 py-3">{cuenta.direccionProveedor}</td>
      <td className={`px-2 py-1 text-center`}>
        <Button label={cuenta.estadoCuenta} color={`${getEstadoColor(cuenta.estadoCuenta)}`} />
      </td>
      <td className="px-4 py-3 ">
        <Button label="Ver" onClick={() => handleVerCuenta(cuenta.id)} color="neutral" />
      </td>
    </>
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Cuentas</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <Button label="Crear Cuenta" onClick={() => setIsFormModalOpen(true)} color="green" />

      <Table className="mt-4" columns={columnas} data={cuentas} renderRow={renderRow} />

      {/* Modal Detalle Cuenta */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle Cuenta">
        {cuentaSeleccionada && (
          <div>
            <p><strong>Nombre:</strong> {cuentaSeleccionada.name}</p>
            <p><strong>Proveedor:</strong> {cuentaSeleccionada.nombreProveedor}</p>
            <p><strong>Celular:</strong> {cuentaSeleccionada.numeroCelular}</p>
            <p><strong>Email:</strong> {cuentaSeleccionada.emailProveedor}</p>
            <p><strong>Dirección:</strong> {cuentaSeleccionada.direccionProveedor}</p>
            <p><strong>Saldo:</strong> ${cuentaSeleccionada.saldo}</p>
            <p><strong>Estado Cuenta:</strong> {cuentaSeleccionada.estadoCuenta}</p>
            <p><strong>Fecha Baja Lógica:</strong> {new Date(cuentaSeleccionada.fechaBajaLogicaCuenta).toLocaleString()}</p>
            <h3 className="mt-4 text-xl font-semibold">Movimientos:</h3>
            {cuentaSeleccionada.movimiento.length > 0 ? (
              cuentaSeleccionada.movimiento.map((movimiento) => (
                <div key={movimiento.id} className="mt-3">
                  <p><strong>Importe Movimiento:</strong> ${movimiento.importeMovimiento}</p>
                  <p><strong>Medio de Pago:</strong> {movimiento.medioPago}</p>
                  <p><strong>Comentario:</strong> {movimiento.comentarioMovimiento}</p>
                  <p><strong>Fecha Alta Movimiento:</strong> {new Date(movimiento.fechaAltaMovimiento).toLocaleString()}</p>
                  <p><strong>Fecha Baja Movimiento:</strong> {new Date(movimiento.fechaBajaMovimiento).toLocaleString()}</p>
                  <h4 className="mt-2 text-lg font-semibold">Comprobantes:</h4>
                  {movimiento.comprobantes.length > 0 ? (
                    movimiento.comprobantes.map((comprobante) => (
                      <div key={comprobante.id}>
                        <p><strong>Tipo Comprobante:</strong> {comprobante.tipoComprobante}</p>
                        <p><strong>Descripción:</strong> {comprobante.descripcion}</p>
                        <p><strong>Monto:</strong> ${comprobante.montoComprobante}</p>
                        <p><strong>Número Comprobante:</strong> {comprobante.nroComprobante}</p>
                        <p><strong>Fecha Comprobante:</strong> {new Date(comprobante.fechaComprobante).toLocaleString()}</p>
                        <p><strong>Fecha Alta Comprobante:</strong> {new Date(comprobante.fechaAltaComprobante).toLocaleString()}</p>
                        <p><strong>Fecha Baja Comprobante:</strong> {new Date(comprobante.fechaBajaComprobante).toLocaleString()}</p>
                        <p><strong>Válido:</strong> {comprobante.valid ? 'Sí' : 'No'}</p>
                      </div>
                    ))
                  ) : <p>No hay comprobantes registrados.</p>}
                </div>
              ))
            ) : <p>No hay movimientos registrados.</p>}
          </div>
        )}
      </Modal>

      {/* Modal Crear Cuenta */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Crear Nueva Cuenta">
        <form onSubmit={handleCrearCuenta}>
          <Input
            label="Nombre de la Cuenta"
            type="text"
            value={nombreCuenta}
            onChange={(e) => setNombreCuenta(e.target.value)}
          />
          <Input
            label="Nombre del Proveedor"
            type="text"
            value={nombreProveedor}
            onChange={(e) => setNombreProveedor(e.target.value)}
          />
          <Input
            label="Número de Celular"
            type="text"
            value={numeroCelular}
            onChange={(e) => setNumeroCelular(e.target.value)}
          />
          <Input
            label="Email del Proveedor"
            type="email"
            value={emailProveedor}
            onChange={(e) => setEmailProveedor(e.target.value)}
          />
          <Input
            label="Dirección del Proveedor"
            type="text"
            value={direccionProveedor}
            onChange={(e) => setDireccionProveedor(e.target.value)}
          />
          <Button label="Guardar" type="submit" color="green" />
        </form>
      </Modal>
    </div>
  );
}

export default Cuentas;
