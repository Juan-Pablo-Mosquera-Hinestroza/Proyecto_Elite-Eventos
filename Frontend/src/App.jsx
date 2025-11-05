import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Visitor from "./components/Visitor/Visitor";
import SobreNosotros from "./components/Visitor/SobreNosotros";
import Register from "./components/register/Register";
import Login from "./components/Login/Login";
import Haciendas from "./components/User/Haciendas";
import HaciendaDetail from "./components/Haciendas/Hacienda1";
import Hacienda2 from "./components/Haciendas/Hacienda2";
import Hacienda3 from "./components/Haciendas/Hacienda3";
import Hacienda4 from "./components/Haciendas/Hacienda4";
import Opciones from "./components/Pagos/Opciones";
import Decoraciones from "./components/Pagos/Decoraciones";
import Factura from "./components/Pagos/Factura";
import MetodoPago from "./components/Pagos/Metodo";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/visitor" />} />
        <Route path="/visitor" element={<Visitor />} />
        <Route path="/sobrenosotros" element={<SobreNosotros />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/haciendas" element={<Haciendas />} />
        <Route path="/hacienda1" element={<HaciendaDetail />} />
        <Route path="/hacienda2" element={<Hacienda2 />} />
        <Route path="/hacienda3" element={<Hacienda3 />} />
        <Route path="/hacienda4" element={<Hacienda4 />} />
        <Route path="/opciones" element={<Opciones />} />
        <Route path="/decoraciones" element={<Decoraciones />} />
        <Route path="/factura" element={<Factura />} />
        <Route path="/metodo" element={<MetodoPago />} />
      </Routes>
    </Router>
  );
}

export default App;