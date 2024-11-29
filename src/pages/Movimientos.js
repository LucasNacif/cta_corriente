import React, { useEffect, useState } from 'react';
import { obtenerMovimientos } from '../api/movimientos.js';

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [error, setError] = useState(null);

  // Cargar movimientos al montar el componente
  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        const data = await obtenerMovimientos();
        setMovimientos(data); 
      } catch (error) {
        setError('Error al obtener los movimientos');
        console.error(error);
      }
    };

    fetchMovimientos();
  }, []);

  

  return (
    <div>
      <h1>Página de Movimientos</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {movimientos.length > 0 ? (
          movimientos.map((movimiento) => (
            <li key={movimiento.id}>
              <strong>Comentario:</strong> {movimiento.comentarioMovimiento} <br />
              <strong>Importe:</strong> ${movimiento.importeMovimiento} <br />
              <strong>Medio de Pago:</strong> {movimiento.medioPago} <br />
              <strong>Fecha:</strong> {new Date(movimiento.fechaAltaMovimiento).toLocaleDateString()} <br />
           
            </li>
          ))
        ) : (
          <p>No hay movimientos disponibles.</p>
        )}
      </ul>
    </div>
  );
}

export default Movimientos;
