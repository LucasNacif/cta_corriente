import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutSidebar from './components/layout/LayoutSidebar';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Cuentas from './pages/Cuentas';
import Movimientos from './pages/Movimientos';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/layout/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout><Login /></Layout>} />
                <Route path="/dashboard" element={<ProtectedRoute><LayoutSidebar><Dashboard /></LayoutSidebar></ProtectedRoute>} />
                <Route path="/cuentas" element={<ProtectedRoute><LayoutSidebar><Cuentas /></LayoutSidebar></ProtectedRoute>} />
                <Route path="/movimientos" element={<ProtectedRoute><LayoutSidebar><Movimientos /></LayoutSidebar></ProtectedRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
