import React, { useEffect, useState } from 'react';
import { crearCuenta, cambiarEstadoCuenta, verCuentas, verCuentaPorId } from '../api/cuentas';

function Cuentas() {
  const [cuentas, setCuentas] = useState([]); // Lista de cuentas
  const [error, setError] = useState(null); // Manejo de errores
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null); // Cuenta para el modal
  const [formData, setFormData] = useState({
    name: '',
    nombreProveedor: '',
    numeroCelular: '',
    emailProveedor: '',
    direccionProveedor: '',
  }); // Formulario para crear cuenta

  // Cargar cuentas al montar el componente
  useEffect(() => {
    const fetchCuentas = async () => {
      try {
        const data = await verCuentas();
        setCuentas(data || []);
      } catch (error) {
        setError('Error al cargar las cuentas');
      }
    };

    fetchCuentas();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Crear nueva cuenta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearCuenta(formData);
      const data = await verCuentas(); // Refrescar la lista de cuentas
      setCuentas(data || []);
      setFormData({
        name: '',
        nombreProveedor: '',
        numeroCelular: '',
        emailProveedor: '',
        direccionProveedor: '',
      }); // Limpiar formulario
    } catch (error) {
      setError('Error al crear la cuenta');
    }
  };

  // Cambiar estado de la cuenta
  const handleChangeEstado = async (idCuenta) => {
    try {
      const data = await cambiarEstadoCuenta(idCuenta);
      console.log('Nuevo estado:', data);
      const cuentasActualizadas = await verCuentas(); // Refresca la lista de cuentas
      setCuentas(cuentasActualizadas || []);
    } catch (error) {
      console.error('Error al cambiar el estado:', error.message);
      setError('Error al cambiar el estado de la cuenta'); // Mostrar mensaje al usuario
    }
  };

  // Ver detalles de una cuenta
  const handleVerCuenta = async (idCuenta) => {
    try {
      const cuenta = await verCuentaPorId(idCuenta);
      setCuentaSeleccionada(cuenta);
    } catch (error) {
      setError('Error al obtener detalles de la cuenta');
    }
  };

  return (
    <div className="cuentas-container">
      <h1>Gestión de Cuentas</h1>

      {/* Mostrar errores */}
      {error && <p className="error">{error}</p>}

      {/* Formulario para crear una cuenta */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de la Cuenta:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nombre del Proveedor:</label>
          <input
            type="text"
            name="nombreProveedor"
            value={formData.nombreProveedor}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Número de Celular:</label>
          <input
            type="text"
            name="numeroCelular"
            value={formData.numeroCelular}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email del Proveedor:</label>
          <input
            type="email"
            name="emailProveedor"
            value={formData.emailProveedor}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Dirección del Proveedor:</label>
          <input
            type="text"
            name="direccionProveedor"
            value={formData.direccionProveedor}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Crear Cuenta</button>
      </form>

      {/* Tabla de cuentas */}
      <table className="tabla-cuentas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Proveedor</th>
            <th>Celular</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((cuenta) => (
            <tr key={cuenta.id}>
              <td>{cuenta.id}</td>
              <td>{cuenta.name}</td>
              <td>{cuenta.nombreProveedor}</td>
              <td>{cuenta.numeroCelular}</td>
              <td>{cuenta.emailProveedor}</td>
              <td>{cuenta.direccionProveedor}</td>
              <td>{cuenta.fechaBajaLogicaCuenta ? 'Inactiva' : 'Activa'}</td>
              <td>
                <button onClick={() => handleVerCuenta(cuenta.id)}>Ver</button>
                <button onClick={() => handleChangeEstado(cuenta.id)}>
                  {cuenta.fechaBajaLogicaCuenta ? 'Activar' : 'Desactivar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para mostrar detalles de una cuenta */}
      {cuentaSeleccionada && (
        <div className="modal">
          <h2>Detalles de la Cuenta</h2>
          <p>ID: {cuentaSeleccionada.id}</p>
          <p>Nombre: {cuentaSeleccionada.name}</p>
          <p>Proveedor: {cuentaSeleccionada.nombreProveedor}</p>
          <p>Celular: {cuentaSeleccionada.numeroCelular}</p>
          <p>Email: {cuentaSeleccionada.emailProveedor}</p>
          <p>Dirección: {cuentaSeleccionada.direccionProveedor}</p>
          <p>Estado: {cuentaSeleccionada.fechaBajaLogicaCuenta ? 'Inactiva' : 'Activa'}</p>
          <button onClick={() => setCuentaSeleccionada(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

export default Cuentas;
