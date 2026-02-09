import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import MenuInicial from './pages/MenuInicial';
import ConsultarInventario from './pages/ConsultarInventario';
import EscanerQR from './pages/EscanerQR';
import HistorialArticulo from './pages/HistorialArticulo';
import ConsultarSalidas from './pages/ConsultarSalidas';
import ControlSalidas from './pages/ControlSalidas';
import Login from './pages/Login';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { WarehouseAuthorizedRoute } from './components/WarehouseAuthorizedRoute';

import ProyeccionCompras from './pages/ProyeccionCompras';
import ConsultaActivos from './pages/ConsultaActivos';

function App() {
    return (
        <ThemeProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<MenuInicial />} />
                        <Route path="/articulos/consultar-inventario" element={<ConsultarInventario />} />
                        <Route path="/articulos/escaner-qr" element={<EscanerQR />} />
                        <Route path="/articulos/consultar-salidas" element={<ConsultarSalidas />} />
                        <Route path="/articulos/historial-articulo" element={<HistorialArticulo />} />
                        <Route element={<WarehouseAuthorizedRoute />}>
                            <Route path="/articulos/control-salidas" element={<ControlSalidas />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
