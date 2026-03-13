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
import Articulos from './pages/Articulos';
import GenerarEtiqueta from './pages/GenerarEtiqueta';
import RegistrarArticulo from './pages/RegistrarArticulo';
import IngresarArticulo from './pages/IngresarArticulo';
import KardexDiario from './pages/KardexDiario';
import Devoluciones from './pages/Devoluciones';
import GestionImagenes from './pages/GestionImagenes';

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
                        <Route path="/articulos" element={<Articulos />} />
                        <Route path="/articulos/consultar-inventario" element={<ConsultarInventario />} />
                        <Route path="/articulos/escaner-qr" element={<EscanerQR />} />
                        <Route path="/articulos/consultar-salidas" element={<ConsultarSalidas />} />
                        <Route path="/articulos/historial-articulo" element={<HistorialArticulo />} />
                        <Route path="/articulos/registrar-nuevo" element={<RegistrarArticulo />} />
                        <Route path="/articulos/ingresar-articulo" element={<IngresarArticulo />} />
                        <Route path="/articulos/kardex-diario" element={<KardexDiario />} />
                        <Route path="/articulos/devoluciones" element={<Devoluciones />} />
                        <Route path="/articulos/gestion-imagenes" element={<GestionImagenes />} />
                        
                        <Route element={<WarehouseAuthorizedRoute />}>
                            <Route path="/articulos/control-salidas" element={<ControlSalidas />} />
                            <Route path="/articulos/generar-etiqueta" element={<GenerarEtiqueta />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </ThemeProvider>
    );
}

export default App;
