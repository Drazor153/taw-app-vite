import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);
  });
  return <h1>Cargando...</h1>;
}
