import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutSidebar from './components/LayoutSidebar';
import Layout from './components/Layout';
import Login from './pages/Login';
import Comprobantes from './pages/Comprobantes';
import Cuentas from './pages/Cuentas';
import Movimientos from './pages/Movimientos';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><Login /></Layout>} />
                <Route path="/dashboard" element={<ProtectedRoute><LayoutSidebar><Dashboard /></LayoutSidebar></ProtectedRoute>} />
                <Route path="/cuentas" element={<ProtectedRoute><LayoutSidebar><Cuentas /></LayoutSidebar></ProtectedRoute>} />
                <Route path="/movimientos" element={<ProtectedRoute><LayoutSidebar><Movimientos /></LayoutSidebar></ProtectedRoute>} />
                <Route path="/comprobantes" element={<ProtectedRoute><LayoutSidebar><Comprobantes /></LayoutSidebar></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
