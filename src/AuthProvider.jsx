import { createContext, useState, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

// ====== Codigo para crear horas de los bloques ======
const sumarMinutos = (date, minutos) => {
  date.setMinutes(date.getMinutes() + minutos);
};
const obtHoraMin = (date) => {
  let horas = date.getHours();
  let minutos = date.getMinutes();
  return `${horas}:${minutos < 10 ? `0${minutos}` : minutos}`;
};

const inicio_dia = new Date("March 5, 2023 08:00:00");
const bloques_termino = [
  { numBloque: 1, minDescanso: 10 },
  { numBloque: 3, minDescanso: 10 },
  { numBloque: 5, minDescanso: 115 },
  { numBloque: 7, minDescanso: 5 },
  { numBloque: 9, minDescanso: 5 },
  { numBloque: 11, minDescanso: 5 },
];
const bloques_hora = [];

for (let i = 0; i < 15; i++) {
  const horaInicio = obtHoraMin(inicio_dia);
  sumarMinutos(inicio_dia, 45);
  const horaTermino = obtHoraMin(inicio_dia);
  bloques_hora.push({bloquesString: `${i+1}`, bloqueHora: true, horaInicio, horaTermino });

  const bloque_termino = bloques_termino.find(
    (bloque) => bloque.numBloque === i
  );
  if (bloque_termino !== undefined) {
    sumarMinutos(inicio_dia, bloque_termino.minDescanso);
  }
}
// ====== ====== ====== ====== ======


const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [dataUser, setDataUser] = useState({});

  const authAPI = async (data) => {
    if (!data.rut || !data.password) {
      return null;
    }
    try {
      const url = import.meta.env.VITE_API_URL_LOGIN;
      const requestOptions = {
        method: "POST",
        // credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      };
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("La solicitud de autenticación ha fallado");
      }

      const responseData = response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleLogin = async (data) => {
    const token_temp = await authAPI(data);
    if (token_temp.logeo === 1) {
      const data = JSON.parse(token_temp.data);
      data.cargo_adm = data.cargo_adm === null ? 'DO': data.cargo_adm;
      setDataUser(data);
      // for (const key in data) {
      //   localStorage.setItem(`${key}`, `${data[key]}`);
      // }
      // localStorage.setItem("SESSION_KEY", token_temp.key);
      setToken(token_temp);
      return { success: 1 };
    } else {
      return { success: 0 };
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    dataUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  if (!token) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }
  return children;
}

const asignContext = createContext(null);

export { AuthContext, AuthProvider, ProtectedRoute, asignContext, bloques_hora };
