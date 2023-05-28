import { createContext, useState, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext(null);
const useAuth = () => {
  return useContext(AuthContext);
};

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

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
      for (const key in data) {
        localStorage.setItem(`${key}`, `${data[key]}`);
      }
      localStorage.setItem("SESSION_KEY", token_temp.key);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate replace to="/login" state={{ from: location }} />;
  }
  return children;
}

export { useAuth, AuthProvider, ProtectedRoute };
