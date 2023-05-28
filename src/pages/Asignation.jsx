import { useState } from "react";
import HorarioDispoSala from "./components/HorarioDispoSala";
import CarPlanComponent from "./components/CarPlanComponent";

export default function Asignation() {
  const [carreraSel, setCarreraSel] = useState(0);
  const updCar = (v) => {
    setShowMalla(false);
    setCarreraSel(v);
  };
  const [planSel, setPlanSel] = useState(0);
  const updPlan = (v) => {
    setShowMalla(false);
    setPlanSel(v);
  };
  const [showMalla, setShowMalla] = useState(false);

  // Malla de la carrera y plan escogidos
  const [malla, setMalla] = useState([]);

  const handleInfo = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL +
          "malla?" +
          new URLSearchParams({
            carrera: carreraSel,
            plan: planSel,
          })
      );
      if (response.ok) {
        const data = await response.json();
        setMalla(data);
        setShowMalla(true);
      }
    } catch (error) {
      console.log("Error en la solicitud:", error);
    }
  };

  return (
    <div id="mallaP">
      <h1>Seccion Malla Curricular</h1>
      <CarPlanComponent
        setCarreraExt={updCar}
        setPlanExt={updPlan}
        actionInfo={handleInfo}
      />
      {showMalla && <HorarioDispoSala ramosExt={malla}/>}
      
    </div>
  );
}