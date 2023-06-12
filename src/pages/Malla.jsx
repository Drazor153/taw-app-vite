import { useState } from "react";
import CarPlanComponent from "./components/CarPlanComponent";
import MallaComponent from "./components/MallaComponent";

export default function Malla() {
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
    <div className="mallaP">
      <h1>Seccion Malla Curricular</h1>
      <CarPlanComponent
        setCarreraExt={updCar}
        setPlanExt={updPlan}
        actionInfo={handleInfo}
      />
      {showMalla && <MallaComponent ramos={malla} />}
    </div>
  );
}
