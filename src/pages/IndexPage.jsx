import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 500);
  });

  return (
    <div className="flex-row">
      <h2>Cargando...</h2>
    </div>
  );
}
