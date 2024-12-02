import React, { useState, useEffect } from 'react';
import { comprobanteApi } from '../api/comprobantes'; // Adjust the import path as needed

// Enum for TipoComprobante to match backend
const TipoComprobante = {
  FACTURA: 'FACTURA',
  NOTA_DEBITO: 'NOTA_DEBITO',
  NOTA_CREDITO: 'NOTA_CREDITO',
  RECIBO: 'RECIBO',
  REMITO: 'REMITO',
  TICKET: 'TICKET'
};

const ComprobanteManager = () => {
  // State for form data
  const [formData, setFormData] = useState({
    tipoComprobante: '',
    descripcion: '',
    nroComprobante: '',
    fechaComprobante: '',
    montoComprobante: '',
    movimientoId: ''
  });

  // State for errors
  const [errors, setErrors] = useState({});

  // State for comprobantes list
  const [comprobantes, setComprobantes] = useState([]);

  // State for selected comprobante
  const [selectedComprobante, setSelectedComprobante] = useState(null);

  // State for view mode
  const [viewMode, setViewMode] = useState('create'); // create, list, edit

  // Fetch all comprobantes
  const fetchComprobantes = async () => {
    try {
      const data = await comprobanteApi.getAll();
      setComprobantes(data);
      setViewMode('list');
    } catch (error) {
      console.error('Error fetching comprobantes:', error);
      alert('Error al obtener los comprobantes');
    }
  };

  // Fetch comprobante by ID
  const fetchComprobanteById = async (id) => {
    try {
      const data = await comprobanteApi.getById(id);
      setSelectedComprobante(data);
      setViewMode('edit');
      
      // Populate form with selected comprobante data
      setFormData({
        tipoComprobante: data.tipoComprobante,
        descripcion: data.descripcion,
        nroComprobante: data.nroComprobante,
        fechaComprobante: data.fechaComprobante,
        montoComprobante: data.montoComprobante,
        movimientoId: data.movimientoId
      });
    } catch (error) {
      console.error('Error fetching comprobante:', error);
      alert('Error al obtener el comprobante');
    }
  };

  // Change comprobante state
  const handleChangeState = async (id) => {
    try {
      await comprobanteApi.changeState(id);
      alert('Estado del comprobante cambiado exitosamente');
      fetchComprobantes(); // Refresh the list
    } catch (error) {
      console.error('Error changing comprobante state:', error);
      alert('Error al cambiar el estado del comprobante');
    }
  };

  // Handle input changes (same as previous implementation)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Validate form (same as previous implementation)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.tipoComprobante) {
      newErrors.tipoComprobante = 'Tipo de comprobante es obligatorio';
    }
    if (!formData.descripcion) {
      newErrors.descripcion = 'Descripción es obligatoria';
    }
    if (!formData.nroComprobante) {
      newErrors.nroComprobante = 'Número de comprobante es obligatorio';
    }
    if (!formData.fechaComprobante) {
      newErrors.fechaComprobante = 'Fecha del comprobante es obligatoria';
    }
    if (!formData.montoComprobante) {
      newErrors.montoComprobante = 'Monto del comprobante es obligatorio';
    }
    if (!formData.movimientoId) {
      newErrors.movimientoId = 'ID de movimiento es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submissionData = {
        ...formData,
        nroComprobante: Number(formData.nroComprobante),
        montoComprobante: Number(formData.montoComprobante)
      };

      const response = await comprobanteApi.save(null, submissionData);
      
      // Reset form after successful submission
      setFormData({
        tipoComprobante: '',
        descripcion: '',
        nroComprobante: '',
        fechaComprobante: '',
        montoComprobante: '',
        movimientoId: ''
      });

      alert('Comprobante creado exitosamente');
      fetchComprobantes(); // Refresh the list
    } catch (error) {
      console.error('Error al crear comprobante:', error);
      alert('Error al crear comprobante. Por favor, intente nuevamente.');
    }
  };

  // Render form (similar to previous implementation)
  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      {/* Form fields (same as previous implementation) */}
      {/* Tipo de Comprobante */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tipo de Comprobante
        </label>
        <select
          name="tipoComprobante"
          value={formData.tipoComprobante}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.tipoComprobante ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Seleccione un tipo</option>
          {Object.values(TipoComprobante).map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        {errors.tipoComprobante && (
          <p className="text-red-500 text-xs italic">{errors.tipoComprobante}</p>
        )}
      </div>

        {/* Descripción */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Descripción
          </label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ingrese descripción"
          />
          {errors.descripcion && (
            <p className="text-red-500 text-xs italic">{errors.descripcion}</p>
          )}
        </div>

        {/* Número de Comprobante */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Número de Comprobante
          </label>
          <input
            type="number"
            name="nroComprobante"
            value={formData.nroComprobante}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.nroComprobante ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ingrese número de comprobante"
          />
          {errors.nroComprobante && (
            <p className="text-red-500 text-xs italic">{errors.nroComprobante}</p>
          )}
        </div>

        {/* Fecha de Comprobante */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Fecha de Comprobante
          </label>
          <input
            type="date"
            name="fechaComprobante"
            value={formData.fechaComprobante}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.fechaComprobante ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.fechaComprobante && (
            <p className="text-red-500 text-xs italic">{errors.fechaComprobante}</p>
          )}
        </div>

        {/* Monto de Comprobante */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Monto de Comprobante
          </label>
          <input
            type="number"
            name="montoComprobante"
            value={formData.montoComprobante}
            onChange={handleChange}
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md ${errors.montoComprobante ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ingrese monto"
          />
          {errors.montoComprobante && (
            <p className="text-red-500 text-xs italic">{errors.montoComprobante}</p>
          )}
        </div>

        {/* Movimiento ID */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ID de Movimiento
          </label>
          <input
            type="text"
            name="movimientoId"
            value={formData.movimientoId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.movimientoId ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ingrese ID de movimiento"
          />
          {errors.movimientoId && (
            <p className="text-red-500 text-xs italic">{errors.movimientoId}</p>
          )}
        </div>

         {/* Submit Button */}
      <div className="flex items-center justify-center">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {viewMode === 'edit' ? 'Actualizar Comprobante' : 'Crear Comprobante'}
        </button>
      </div>
    </form>
  );

  // Render comprobantes list
  const renderComprobantesList = () => (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Lista de Comprobantes</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Número</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Monto</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comprobantes.map((comprobante) => (
            <tr key={comprobante.id} className="hover:bg-gray-100">
              <td className="border p-2">{comprobante.tipoComprobante}</td>
              <td className="border p-2">{comprobante.descripcion}</td>
              <td className="border p-2">{comprobante.nroComprobante}</td>
              <td className="border p-2">{comprobante.fechaComprobante}</td>
              <td className="border p-2">{comprobante.montoComprobante}</td>
              <td className="border p-2">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => fetchComprobanteById(comprobante.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleChangeState(comprobante.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Cambiar Estado
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Main render
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mb-4">
        <button 
          onClick={() => setViewMode('create')}
          className={`mr-2 px-4 py-2 rounded ${viewMode === 'create' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Crear Comprobante
        </button>
        <button 
          onClick={fetchComprobantes}
          className={`px-4 py-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Listar Comprobantes
        </button>
      </div>

      {viewMode === 'create' || viewMode === 'edit' ? (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {viewMode === 'edit' ? 'Editar Comprobante' : 'Crear Comprobante'}
          </h2>
          {renderForm()}
        </div>
      ) : (
        renderComprobantesList()
      )}
    </div>
  );
};

export default ComprobanteManager;