import { useEffect, useState } from "react";
import "../styles/horarioDocente.css";
import { bloques_hora } from "../AuthProvider";

export default function HorarioDocente() {
  const [arrayDocentes, setArrayDocentes] = useState([]);
  const [arrayAsign, setArrayAsign] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}all-profesores`
      );
      if (response.ok) {
        const data = await response.json();
        setArrayDocentes(data.arrayDocentes);
      }
    };

    fetchData().catch((error) => console.error(error));
  }, []);

  const selectHandler = async (e) => {
    const rut = e.target.value;
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}horario-docente?` +
        new URLSearchParams({
          rutDocente: rut,
        })
    );
    if (response.ok) {
      const data = await response.json();
      setArrayAsign(data);
    }
  };
  return (
    <section className="home">
      <div id="horario-docente">
        <div className="selector-docente">
          <select onChange={selectHandler}>
            <option value="0">Seleccione un docente</option>
            {arrayDocentes.map((docente) => (
              <option key={docente.rut} value={docente.rut}>
                {docente.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="div-horario">
          <HorarioSala data={arrayAsign} />
        </div>
      </div>
    </section>
  );
}

function HorarioSala({ data }) {
  if (data === null) {
    return <></>;
  }
  const data_local = [];
  for (let i = 0; i < data.asignaciones.length; i++) {
    data_local.push([bloques_hora[i], ...data.asignaciones[i]]);
  }

  return (
    <div className="horario" id="horarioAsign">
      <table>
        <thead>
          <tr>
            <th>Horas</th>
            <th>Lunes</th>
            <th>Martes</th>
            <th>Miercoles</th>
            <th>Jueves</th>
            <th>Viernes</th>
          </tr>
        </thead>
        <tbody>
          {data_local.map((fila, i) => (
            <FilaAsignaciones key={i} filaAsign={fila} filaNum={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FilaAsignaciones({ filaAsign, filaNum }) {
  return (
    <tr>
      {filaAsign.map((asign, i) => {
        return (
          <BloqueDispoSala
            key={[filaNum, i - 1]}
            asignacion={asign}
            k={[filaNum, i - 1]}
          />
        );
      })}
    </tr>
  );
}
function BloqueDispoSala({ asignacion, k}) {
  if (asignacion === null) {
    k.push("none");
    return <td id={k}>SIN ASIGNACION</td>;
  }
  if (asignacion.bloqueHora) {
    return (
      <td className="horaBloque">{`${asignacion.horaInicio} - ${asignacion.horaTermino}`}</td>
    );
  }
  k.push(asignacion.cod_ramo);
  return (
    <td id={k} className="asignado">
      {`${asignacion.cod_ramo}`}
      <br />
      {asignacion.ramo}
      <br />
      {`Grupo ${asignacion.grupo}`}
      <br />
      {`${asignacion.sala}`}
    </td>
  );
}
