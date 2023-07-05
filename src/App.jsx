import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomeNavbar from "./pages/components/HomeNavbar";
import Asignation from "./pages/Asignation";
import Malla from "./pages/Malla";
import HorarioDocente from "./pages/HorarioDocente";
import HorarioDocDispo from "./pages/HorarioDocDispo";
import { HomeUser } from "./pages/HomeUser";
import { HomePage } from "./pages/IndexPage";

import "./styles/navbar.css";
import "./styles/login.css";
import "./styles/malla.css";
import "./styles/carplan.css";

import { AuthProvider, ProtectedRoute } from "./AuthProvider";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/inicio"
          element={
            <ProtectedRoute>
              <HomeNavbar />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeUser />} />
          <Route path="asignacion" element={<Asignation />} />
          <Route path="malla-curricular" element={<Malla />} />
          <Route path="horario-docente" element={<HorarioDocente />} />
          <Route path="horario-disponible" element={<HorarioDocDispo />} />

          <Route path="*" element={<HomeUser />} />
        </Route>
        <Route path="/*" element={<HomePage />} />
      </Routes>
      {/* <Navegator /> */}
    </AuthProvider>
  );
};

export default App;
