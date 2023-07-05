import { useEffect, useState } from "react";
import "../styles/horarioDocente.css";

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
  { numBloque: 5, minDescanso: 105 },
  { numBloque: 7, minDescanso: 5 },
  { numBloque: 9, minDescanso: 5 },
  { numBloque: 11, minDescanso: 5 },
];
const bloques_hora = [];

for (let i = 0; i < 15; i++) {
  const horaInicio = obtHoraMin(inicio_dia);
  sumarMinutos(inicio_dia, 45);
  const horaTermino = obtHoraMin(inicio_dia);
  bloques_hora.push({ bloqueHora: true, horaInicio, horaTermino });

  const bloque_termino = bloques_termino.find(
    (bloque) => bloque.numBloque === i
  );
  if (bloque_termino !== undefined) {
    sumarMinutos(inicio_dia, bloque_termino.minDescanso);
  }
}
// ====== ====== ====== ====== ======

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
  // const { arrayBloques } = useContext(asignContext);
  return (
    <tr>
      {filaAsign.map((asign, i) => {
        //   const selected = arrayBloques.some(
        //     (item) => item.dia === i && item.bloque === filaNum + 1
        //   );
        return (
          <BloqueDispoSala
            key={[filaNum, i - 1]}
            asignacion={asign}
            k={[filaNum, i - 1]}
            //   selected={selected}
          />
        );
      })}
    </tr>
  );
}
function BloqueDispoSala({ asignacion, k, selected }) {
  // const { addBloque } = useContext(asignContext);
  const action = function () {
    //   if (k[2] !== "none") return;
    //   const bloque = {
    //     dia: k[1] + 1,
    //     bloque: k[0] + 1,
    //   };
    //   addBloque(bloque);
    console.log(k);
  };

  if (asignacion === null) {
    k.push("none");
    return (
      <td
        id={k}
        onClick={action}
        //   className={selected ? "bloque-seleccionado" : ""}
      >
        SIN ASIGNACION
      </td>
    );
  }
  if (asignacion.bloqueHora) {
    return (
      <td className="horaBloque">{`${asignacion.horaInicio} - ${asignacion.horaTermino}`}</td>
    );
  }
  k.push(asignacion.cod_ramo);
  return (
    <td
      id={k}
      className={selected ? "asignado bloque-seleccionado" : "asignado"}
      onClick={action}
    >
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
