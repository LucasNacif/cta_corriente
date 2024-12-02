import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Table from '../components/Table';
import { Users, Plus } from 'lucide-react';

import { obtenerTodosMovimientos } from '../api/movimientos';

const Componentes = () => {
  //Necesarios en page para el funcionamiento del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


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

  return (
    <div className="p-4">

      {/* Uso de Modal*/}
      <p className="font-medium pt-4">Modal</p>
      <p className="font-normal text-sm pb-2">Usar funciones openModal() y closeModal()</p>

      <Button icon={Plus} label="Abrir Modal" onClick={openModal} color="green" />
      <Modal isOpen={isModalOpen} onClose={closeModal} icon={Users} title="Modal Personalizado" />


      {/* Uso de Button*/}
      <p className="font-medium pt-4">Button</p>
      <p className="font-normal text-sm pb-2">Tiene variables "red", "green" y "neutral". Puede tener o no icons, al igual que label. Utilizar iconos de lucide.dev</p>

      <div className='flex space-x-2'>
        <Button icon={Plus} onClick={openModal} color="neutral" />
        <Button icon={Plus} label="red" onClick={openModal} color="red" />
        <Button icon={Plus} label="green" onClick={openModal} color="green" />
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


      {/* Uso del Inputs*/}
      <p className="font-medium pt-4">Inputs</p>
      <p className="font-normal text-sm pb-2">Tamo en eso XD</p>
    </div>

  );
};

export default Componentes;
