import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link , Navigate} from 'react-router-dom';

// Importar componentes de páginas
import Login from './pages/Login';
import Comprobantes from './pages/Comprobantes';
import Cuentas from './pages/Cuentas';
import Movimientos from './pages/Movimientos';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div>
        {/* Menú de navegación */}
        <nav>
          <ul>
            <Link to="/login">Login</Link>
            <Link to="/">Dashboard</Link>
            <Link to="/cuentas">Cuentas</Link>
            <Link to="/movimientos">Movimientos</Link>
            <Link to="/comprobantes">Comprobantes</Link>
          </ul>
        </nav>

        {/* Definición de rutas */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/comprobantes" element={<Comprobantes />} />
          <Route path="/cuentas" element={<Cuentas />} />
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/dashboard" element={<Dashboard />} />

                  {/* Redirección por defecto
        <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;