import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomeNavbar from "./pages/HomeNavbar";
import Asignation from "./pages/Asignation";
import Malla from "./pages/Malla";
import { HomeUser } from "./pages/HomeUser";
import { HomePage } from "./pages/IndexPage";

import "./styles/style.css";
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
          path="/home_user"
          element={
            <ProtectedRoute>
              <HomeNavbar />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeUser />} />
          <Route path="asignacion" element={<Asignation />} />
          <Route path="horario" element={<Malla />} />
          <Route path="*" element={<HomeUser />} />
        </Route>
        <Route path="/*" element={<HomePage />} />
      </Routes>
      {/* <Navegator /> */}
    </AuthProvider>
  );
};

export default App;
