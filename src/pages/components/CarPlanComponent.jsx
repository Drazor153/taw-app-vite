import { useState } from "react";
import { useAuth } from "../../AuthProvider";
import { useEffect } from "react";

// Componente que agrupa los selectos de SELECCIONAR CARRERA y SELECCIONAR PLAN
// Se deben pasar como props las funciones set de cada apartado
export default function CarPlanComponent({ setCarreraExt, setPlanExt, actionInfo }) {
  const { onLogout } = useAuth();

  const [carreras, setCarreras] = useState([]);
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    fetch(
      import.meta.env.VITE_API_URL +
        "carrera?" +
        new URLSearchParams({
          rut: localStorage.getItem("rut"),
          cargo_adm: localStorage.getItem("cargo_adm"),
          key: localStorage.getItem("SESSION_KEY"),
        })
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.logout === 1) {
          onLogout();
          return;
        }
        setCarreras([
          { codigo: 0, nombre: "Selecciona una carrera" },
          ...data.listaCarreras,
        ]);
        setPlanes([...data.planes]);
      })
      .catch((error) => {
        console.error("Ha ocurrido un error:", error);
      });
  }, [onLogout]);
  //   Almacena Carrera escogida
  const [carreraInt, setCarreraInt] = useState({ nombre: "", value: 0 });

  //   Almacena planes de la carrera escogida
  const [planesSelector, setPlanesSelector] = useState({
    codigo: 0,
    planes: [],
  });

  //   Almacena Plan escogido
  const [planInt, setPlanInt] = useState(0);

  const carreraHandle = (e) => {
    let codigo = e.target.value;
    let nombre =
      carreras.filter((c) => parseInt(c.codigo) === parseInt(codigo))[0]
        .nombre || "";
    setCarreraInt({
      value: codigo,
      nombre
    });
    setPlanInt(0);
    setPlanExt(0);

    setCarreraExt(codigo);

    if (codigo <= 0) {
      setPlanesSelector({ codigo: 0, planes: [] });
      return;
    }
    let plan = planes.filter((p) => parseInt(codigo) === p.codigo)[0];
    setPlanesSelector(plan);
  };

  const planHandle = (e) => {
    let plan = e.target.value;
    setPlanInt(plan);

    setPlanExt(plan);
  };

  return (
    <>
      <div id="car-plan">
        <div className="sel">
          <label>Carrera:</label>
          <select value={carreraInt.value} onChange={carreraHandle}>
            {carreras.map((val, i) => (
              <option key={i} value={val.codigo}>
                {val.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="sel">
          <label>Plan:</label>
          <select value={planInt} onChange={planHandle}>
            <option value={0}>Escoja el plan de la carrera</option>
            {planesSelector.planes.map((val, i) => (
              <option key={i} value={val.anio}>
                {val.anio}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Info car={carreraInt.nombre} plan={planInt} action={actionInfo} />
    </>
  );
}
function Info({ car, plan, action }) {
  if (car === "" || plan === 0) {
    return (
      <div className="infoCarPlan">
        <div className="text">No se ha elegido ninguna carrera</div>
      </div>
    );
  }

  return (
    <div className="infoCarPlan">
      <div className="text">
        Ha elegido: <br />
        <b>{car}</b>, plan <b>{plan}</b>
      </div>
      <div className="btnDiv">
        <button onClick={action}>Confirmar seleccion</button>
      </div>
    </div>
  );
}