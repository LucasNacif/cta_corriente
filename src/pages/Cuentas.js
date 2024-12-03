import React, { useEffect, useState } from 'react';
import { verCuentas, verCuentaPorId, crearCuenta } from '../api/cuentas';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Table from '../components/Table';
import Input from '../components/Input';
import Card from '../components/Card';
import AlertBadge from '../components/AlertBadge';
import { X, Search, Plus, ArrowBigLeft, ArrowBigRight } from 'lucide-react';


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

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const data = await verCuentas();
        setCuentas(Array.isArray(data) ? data : []);
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
      setCurrentPage(1); // Resetear a la primera página después de crear una cuenta
    } catch (error) {
      setError('Error al crear la cuenta');
    }
  };

  // Paginación: Calcular las cuentas a mostrar en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cuentas.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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

  const columnas = [
    { header: 'Nombre', align: 'text-left' },
    { header: 'Proveedor', align: 'text-left' },
    { header: 'Celular', align: 'text-center' },
    { header: 'Email', align: 'text-left' },
    { header: 'Dirección', align: 'text-left' },
    { header: 'Estado', align: 'text-center' },
    { header: 'Acciones', align: 'text-end' },
  ];

  const renderRow = (cuenta) => (
    <>
      <td className="px-4 py-3 text-sm">{cuenta.name}</td>
      <td className="px-4 py-3 text-sm">{cuenta.nombreProveedor}</td>
      <td className="px-4 py-3 text-center text-sm">{cuenta.numeroCelular}</td>
      <td className="px-4 py-3 text-sm">{cuenta.emailProveedor}</td>
      <td className="px-4 py-3 text-sm">{cuenta.direccionProveedor}</td>
      <td className={`px-2 py-1 text-center`}>
        <Badge label={cuenta.estadoCuenta.charAt(0).toUpperCase() + cuenta.estadoCuenta.slice(1).toLowerCase()} color={`${getEstadoColor(cuenta.estadoCuenta)}`} />
      </td>
      <td className="px-4 py-3 ">
        <Button icon={Search} label="Ver" onClick={() => handleVerCuenta(cuenta.id)} color="neutral2" />
      </td>
    </>
  );

  // Número de páginas
  const totalPages = Math.ceil(cuentas.length / itemsPerPage);

  return (
    <div className="p-4">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-bold text-center mb-2">Cuentas</h1>
        <div>
          <Button icon={Plus} label="Crear Cuenta" onClick={() => setIsFormModalOpen(true)} color="green" />
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
      <Table className="mt-4" columns={columnas} data={currentItems} renderRow={renderRow} />

      {/* Paginación */}
      <div className="flex justify-end mt-4">
        <Button
          icon={ArrowBigLeft}
          color="neutral2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        />
        <span className="mx-7 flex items-center text-sm font-extralight">Página {currentPage} de {totalPages}</span>
        <Button
          icon={ArrowBigRight}
          color="neutral2"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0} // Deshabilitar si es la última página
        />
      </div>

      {/* Modal Detalle Cuenta */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Detalle Cuenta" label="Resumen de la cuenta" className="md:w-1/2">
        {cuentaSeleccionada && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-md font-semibold text-gray-800">Nombre:</p>
                <p className="text-sm text-gray-600">{cuentaSeleccionada.name}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-800">Proveedor:</p>
                <p className="text-sm text-gray-600">{cuentaSeleccionada.nombreProveedor}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-800">Celular:</p>
                <p className="text-sm text-gray-600">{cuentaSeleccionada.numeroCelular}</p>
              </div>
              <div>
                <p className="text-md font-semibold text-gray-800">Email:</p>
                <p className="text-sm text-gray-600">{cuentaSeleccionada.emailProveedor}</p>
              </div>
              <div className='col-span-2'>
                <p className="text-md font-semibold text-gray-800">Dirección:</p>
                <p className="text-sm text-gray-600">{cuentaSeleccionada.direccionProveedor}</p>
              </div>
            </div>

            <h3 className="mt-6 text-lg font-medium text-gray-900">Movimientos:</h3>
            <Card className="max-h-60 overflow-y-auto border-zinc-400 p-4">
              {cuentaSeleccionada.movimiento.length > 0 ? (
                cuentaSeleccionada.movimiento.map((movimiento, index) => {
                  // Definición del estado y color dentro del map
                  const estado = movimiento.importePagado >= movimiento.importeMovimiento ? 'Al Día' : 'Pendiente';
                  const color = movimiento.importePagado >= movimiento.importeMovimiento ? 'green' : 'yellow';

                  return (
                    <div
                      key={movimiento.id}
                      className={`mt-3 pb-2 ${index !== cuentaSeleccionada.movimiento.length - 1 ? "border-b border-zinc-400" : ""}`}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            <span className="font-semibold ">Importe Movimiento:</span> ${movimiento.importeMovimiento}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            <span className="font-semibold ">Importe Pagado:</span> ${movimiento.importePagado}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            <span className="font-semibold mr-2">Estado:</span>
                            <AlertBadge value={estado} color={color} />
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-gray-700">
                            <span className="font-semibold">Fecha Alta Movimiento:</span> {new Date(movimiento.fechaAltaMovimiento).toLocaleString()}
                          </p>
                          <p className="text-sm font-medium text-gray-700">
                            <span className="font-semibold">Medio de Pago:</span> {movimiento.medioPago
                              .toLowerCase()
                              .replace(/_/g, " ")
                              .split(" ")
                              .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
                              .join(" ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className='text-sm font-medium text-zinc-700'>No hay movimientos registrados.</p>
              )}
            </Card>
          </div>
        )}
      </Modal>

      {/* Modal Crear Cuenta */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Crear Nueva Cuenta" label="Ingrese los datos de la cuenta">
        <form className="pt-4" onSubmit={handleCrearCuenta}>
          <div className="grid grid-cols-1 space-y-3">
            <Input
              label="Nombre de la Cuenta"
              type="text"
              value={nombreCuenta}
              placeholder="Ejemplo: Cuenta Principal"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s]*$/.test(value)) {
                  setNombreCuenta(value);
                }
              }}
            />
            <Input
              label="Nombre del Proveedor"
              type="text"
              value={nombreProveedor}
              placeholder="Ejemplo: Proveedor S.A."
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z\s.-]*$/.test(value)) {
                  setNombreProveedor(value);
                }
              }}
            />
            <Input
              label="Número de Celular"
              type="text"
              value={numeroCelular}
              placeholder="Ejemplo: 1234567890"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setNumeroCelular(value);
                }
              }}
            />
            <Input
              label="Email del Proveedor"
              type="email"
              value={emailProveedor}
              placeholder="Ejemplo: proveedor@email.com"
              onChange={(e) => setEmailProveedor(e.target.value)}
            />
            <Input
              label="Dirección del Proveedor"
              type="text"
              value={direccionProveedor}
              placeholder="Ejemplo: Calle Falsa 123"
              onChange={(e) => {
                const value = e.target.value;
                if (/^[a-zA-Z0-9\s,.-]*$/.test(value)) {
                  setDireccionProveedor(value);
                }
              }}
            />
          </div>
          <div className="pt-5 justify-between flex space-x-10 w-full">
            <Button
              label="Cancelar"
              onClick={() => setIsFormModalOpen(false)}
              color="neutral2"
              className="mt-3 w-full"
            />
            <Button
              label="Guardar"
              type="submit"
              color="green"
              className="mt-3 w-full"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Cuentas;