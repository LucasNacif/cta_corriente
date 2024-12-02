import React, { useState, useEffect } from 'react';
import { comprobanteApi } from '../api/comprobantes'; 
import Modal from '../components/Modal';
import Select from '../components/Select';
import Button from '../components/Button';
import Input from '../components/Input';
import { Edit, List, PlusCircle } from 'lucide-react';

const TipoComprobante = {
  FACTURA: 'FACTURA',
  NOTA_DEBITO: 'NOTA_DEBITO',
  NOTA_CREDITO: 'NOTA_CREDITO',
  RECIBO: 'RECIBO',
  REMITO: 'REMITO',
  TICKET: 'TICKET'
};

const ComprobanteManager = () => {
  const [formData, setFormData] = useState({
    tipoComprobante: '',
    descripcion: '',
    nroComprobante: '',
    fechaComprobante: '',
    montoComprobante: '',
    movimientoId: ''
  });

  const [errors, setErrors] = useState({});
  const [comprobantes, setComprobantes] = useState([]);
  const [selectedComprobante, setSelectedComprobante] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('create');

  const fetchComprobantes = async () => {
    try {
      const data = await comprobanteApi.getAll();
      setComprobantes(data);
      setIsListModalOpen(true);
    } catch (error) {
      console.error('Error fetching comprobantes:', error);
      alert('Error al obtener los comprobantes');
    }
  };

  const fetchComprobanteById = async (id) => {
    try {
      const data = await comprobanteApi.getById(id);
      setSelectedComprobante(data);
      setViewMode('edit');
      setIsModalOpen(true);
      
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

  const handleChangeState = async (id) => {
    try {
      await comprobanteApi.changeState(id);
      alert('Estado del comprobante cambiado exitosamente');
      fetchComprobantes();
    } catch (error) {
      console.error('Error changing comprobante state:', error);
      alert('Error al cambiar el estado del comprobante');
    }
  };

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

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      'tipoComprobante', 'descripcion', 'nroComprobante', 
      'fechaComprobante', 'montoComprobante', 'movimientoId'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} es obligatorio`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

      await comprobanteApi.save(null, submissionData);
      
      setFormData({
        tipoComprobante: '',
        descripcion: '',
        nroComprobante: '',
        fechaComprobante: '',
        montoComprobante: '',
        movimientoId: ''
      });

      alert('Comprobante creado exitosamente');
      setIsModalOpen(false);
      fetchComprobantes();
    } catch (error) {
      console.error('Error al crear comprobante:', error);
      alert('Error al crear comprobante. Por favor, intente nuevamente.');
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Tipo de Comprobante
        </label>
        <Select
          name="tipoComprobante"
          value={formData.tipoComprobante}
          onChange={handleChange}
          error={errors.tipoComprobante}
          options={Object.values(TipoComprobante).map(tipo => ({
            value: tipo,
            label: tipo
          }))}
          placeholder="Seleccione un tipo"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Descripción
        </label>
        <Input
          type="text"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          error={errors.descripcion}
          placeholder="Ingrese descripción"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Número de Comprobante
        </label>
        <Input
          type="number"
          name="nroComprobante"
          value={formData.nroComprobante}
          onChange={handleChange}
          error={errors.nroComprobante}
          placeholder="Ingrese número de comprobante"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Fecha de Comprobante
        </label>
        <Input
          type="date"
          name="fechaComprobante"
          value={formData.fechaComprobante}
          onChange={handleChange}
          error={errors.fechaComprobante}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Monto de Comprobante
        </label>
        <Input
          type="number"
          name="montoComprobante"
          value={formData.montoComprobante}
          onChange={handleChange}
          step="0.01"
          error={errors.montoComprobante}
          placeholder="Ingrese monto"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          ID de Movimiento
        </label>
        <Input
          type="text"
          name="movimientoId"
          value={formData.movimientoId}
          onChange={handleChange}
          error={errors.movimientoId}
          placeholder="Ingrese ID de movimiento"
        />
      </div>

      <div className="flex items-center justify-center space-x-2">
        <Button 
          type="submit" 
          label={viewMode === 'edit' ? 'Actualizar' : 'Crear'}
          color="green"
          icon={PlusCircle}
        />
      </div>
    </form>
  );

  const renderComprobantesList = () => (
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
                <Button 
                  onClick={() => fetchComprobanteById(comprobante.id)}
                  icon={Edit}
                  color="green"
                />
                <Button 
                  onClick={() => handleChangeState(comprobante.id)}
                  label="Estado"
                  color="neutral"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mb-4 space-x-2">
        <Button 
          onClick={() => {
            setViewMode('create');
            setIsModalOpen(true);
          }}
          label="Crear Comprobante"
          icon={PlusCircle}
          color="green"
        />
        <Button 
          onClick={fetchComprobantes}
          label="Listar Comprobantes"
          icon={List}
          color="neutral"
        />
      </div>

      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={viewMode === 'edit' ? 'Editar Comprobante' : 'Crear Comprobante'}
        label="Ingrese los detalles del comprobante"
      >
        {renderForm()}
      </Modal>

      <Modal 
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        title="Lista de Comprobantes"
        label="Visualice y gestione sus comprobantes"
      >
        {renderComprobantesList()}
      </Modal>
    </div>
  );
};

export default ComprobanteManager;