import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';
import Input from '../components/Input';
import { Users, Plus } from 'lucide-react';
import Select from '../components/Select';

import { obtenerTodosMovimientos } from '../api/movimientos';

const Componentes = () => {
  //Necesarios en page para el funcionamiento del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //Segundo Modal, modal con formulario
  const [IsFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  //Tercer Modal, modal ver mas
  const [IsMoreOpen, setIsMoreOpen] = useState(false);
  const openMore = () => setIsMoreOpen(true);
  const closeMore = () => setIsMoreOpen(false);
  //Funcionamiento para mostrar datos de api en tabla
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const data = await obtenerTodosMovimientos();
        setMovimientos(data);
      } catch (error) {
        setError('Error al obtener los movimientos');
        console.error('Error al obtener los movimientos:', error);
      }
    };

    fetchMovimientos();
  }, []);

  //Ajustar columnas a mostrar en tabla
  const columns = [
    { header: 'Comentario', align: 'text-left' },
    { header: 'Importe', align: 'text-center' },
    { header: 'Medio de Pago', align: 'text-center' },
    { header: 'Acciones', align: 'text-end' },
  ];


  //Para Select
  const [selectedOption, setSelectedOption] = useState('');

  const options = [
    { value: '', label: 'Selecciona una opción' },
    { value: '1', label: 'Opción 1' },
    { value: '2', label: 'Opción 2' },
    { value: '3', label: 'Opción 3' },
  ];

  return (
    <div className="p-4">

      {/* Uso de Modal*/}
      <p className="font-medium pt-4">Modal</p>
      <p className="font-normal text-sm pb-2">Usar funciones openModal() y closeModal(). Puede tener title y subtitle</p>

      <Button icon={Plus} label="Abrir Modal" onClick={openModal} color="green" />
      <Modal isOpen={isModalOpen} onClose={closeModal} icon={Users} title="Modal Personalizado" label="Subtitle" />


      {/* Uso de Button*/}
      <p className="font-medium pt-4">Button</p>
      <p className="font-normal text-sm pb-2">Tiene variables "red", "green" y "neutral". Puede tener o no icons, al igual que label. Utilizar iconos de lucide.dev</p>
      <div className='grid grid-cols-3'>
        <div className='flex space-x-2'>
          <Button icon={Plus} onClick={openModal} color="neutral" />
          <Button icon={Plus} label="red" onClick={openModal} color="red" />
          <Button icon={Plus} label="blue" onClick={openModal} color="blue" />
          <Button icon={Plus} label="green" onClick={openModal} color="green" />
        </div>
        <div className='flex space-x-2'>
          <Button icon={Plus} onClick={openModal} color="neutral2" />
          <Button icon={Plus} label="red" onClick={openModal} color="red2" />
          <Button icon={Plus} label="blue" onClick={openModal} color="blue2" />
          <Button icon={Plus} label="green" onClick={openModal} color="green2" />
        </div>
        <div className='flex space-x-2'>
          <Button icon={Plus} onClick={openModal} color="neutral3" />
          <Button icon={Plus} label="red" onClick={openModal} color="red3" />
          <Button icon={Plus} label="blue" onClick={openModal} color="blue3" />
          <Button icon={Plus} label="green" onClick={openModal} color="green3" />
        </div>
      </div>


      {/* Uso de Table*/}
      <p className="font-medium pt-4">Table</p>
      <p className="font-normal text-sm pb-2">Ver código comentado para guiarse.</p>
      {error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <Table
          columns={columns}
          data={movimientos}
          renderRow={(movimiento) => (
            <>
              <td className="px-4 py-3">{movimiento.comentarioMovimiento}</td>
              <td className="px-4 py-3 text-center">${movimiento.importeMovimiento}</td>
              <td className="px-4 py-3 text-center">{movimiento.medioPago}</td>
              <td className="px-4 py-3 flex space-x-3 justify-end">
                <Button label="Ver" onClick={openModal} color="neutral" />
                <Button icon={Plus} label="Baja" onClick={openModal} color="red" />
              </td>
            </>
          )}
        />
      )}


      {/* Uso de Inputs*/}
      <p className="font-medium pt-4">Inputs</p>
      <p className="font-normal text-sm pb-2">Inputs nazis</p>

      <Input label="Nombre" type="text" />
      <Input label="Teléfono" type="number" />
      <Input label="Email" type="email" />
      <Input label="Contraseña" type="password" />

      {/* Uso de Select*/}
      <p className="font-medium pt-4">Select</p>
      <p className="font-normal text-sm pb-2">Select nazi</p>

      <Select
        label="Elige una opción"
        options={options}
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      />

      {/* Ejemplo de Modal con Formulario */}
      <p className="font-medium pt-4">Ejemplo</p>
      <p className="font-normal text-sm pb-2">Formulario con Modal</p>

      <Button icon={Plus} label="Abrir Modal" onClick={openForm} color="green" />
      <Modal isOpen={IsFormOpen} onClose={closeForm} icon={Users} title="Fomrulario en Modal" label="Este es un fomrulario de prueba">

        <form className="grid grid-cols-2 space-x-2">
          <div className='space-y-3'>
            <Input label="Nombre" type="text" />
            <Input label="Teléfono" type="number" />
            <Input label="Email" type="email" />
          </div>
          <div className='space-y-3'>
            <Input label="Cuit" type="text" />
            <Input label="Contraseña" type="password" />
            <Select
              label="Elige una opción"
              options={options}
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
          </div>
          <div className="col-start-2 pt-5">
            <Button icon={Users} label="Enviar" type="submit" color="neutral" className="w-full" />
          </div>
        </form>

      </Modal>

      {/* Ejemplo de Modal Ver Mas */}
      <p className="font-medium pt-4">Ejemplo</p>
      <p className="font-normal text-sm pb-2">Modal ver más</p>

      <Button icon={Plus} label="Abrir Modal" onClick={openMore} color="green" />
      <Modal isOpen={IsMoreOpen} onClose={closeMore} icon={Users} title="Modal ver más" label="Este es un fomrulario de prueba">

        <form className="grid grid-cols-2 space-x-2">
          <div className='space-y-3'>
            <Input label="Nombre" type="text" />
            <Input label="Teléfono" type="number" />
            <Input label="Email" type="email" />
          </div>
          <div className='space-y-3'>
            <Input label="Cuit" type="text" />
            <Input label="Contraseña" type="password" />
            <Select
              label="Elige una opción"
              options={options}
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
          </div>
          <div className="col-start-2 pt-5">
            <Button icon={Users} label="Enviar" type="submit" color="neutral" className="w-full" />
          </div>
        </form>

      </Modal>

    </div>

  );
};

export default Componentes;
