import { useContext, useEffect, useState } from "react";
import { asignContext } from "../../../AuthProvider";

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

export default function HorarioDispo() {
  const [horario, setHorario] = useState(null);
  const { resetBloques } = useContext(asignContext);

  const resetHorario = () => {
    setHorario(null);
  };

  const cargarHorarioSala = async (depa, sala) => {
    resetBloques();
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}sala?` +
        new URLSearchParams({
          depa,
          sala,
        })
    );
    if (response.ok) {
      const data = await response.json();
      setHorario(data);
    }
  };
  return (
    <div id="horarioDispo">
      <UbiSelectors handler={cargarHorarioSala} resetHorario={resetHorario} />
      {horario && <HorarioSala data={horario} />}
    </div>
  );
}
function UbiSelectors({ handler, resetHorario }) {
  // Departamentos Disponibles
  const [depas, setDepas] = useState([]);
  // Salas Disponibles
  const [salas, setSalas] = useState([]);
  const { salaRef } = useContext(asignContext);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}ubicaciones`)
      .then((response) => response.json())
      .then((data) => {
        setDepas(data.depas);
        setSalas(data.salas);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Almacena depa escogido
  const [depaInt, setDepaInt] = useState(0);
  // Almacena salas del depa escogido
  const [salaSel, setSalaSel] = useState([]);
  // Almacena sala escogida
  const [salaInt, setSalaInt] = useState(0);

  useEffect(() => {
    salaRef.current = {
      departamento: depaInt,
      sala: salaInt,
    };
  }, [depaInt, salaInt]);
  const handleDepaInt = (e) => {
    const codigo = parseInt(e.target.value);
    setDepaInt(codigo);
    setSalaInt(0);
    resetHorario();
    if (codigo <= 0) {
      setSalaSel([]);
      return;
    }
    let salas_tmp = salas.filter((val) => val.idDep == codigo);
    setSalaSel(salas_tmp);
  };

  const handleSalaInt = (e) => {
    let codigo = parseInt(e.target.value);
    setSalaInt(codigo);
    handler(depaInt, codigo);
  };

  return (
    <div className="salaSel">
      <div className="sel">
        <label>Departamento:</label>
        <select value={depaInt} onChange={handleDepaInt}>
          <option value={0}>Seleccione un departamento</option>
          {depas.map((depa) => (
            <option key={depa.idDep} value={depa.idDep}>
              {depa.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="sel">
        <label>Sala:</label>
        <select
          value={salaInt}
          onChange={handleSalaInt}
          disabled={depaInt <= 0}
        >
          <option value={0}>Seleccione una sala</option>
          {salaSel.map((sala) => (
            <option key={sala.idSala} value={sala.idSala}>
              {sala.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function HorarioSala({ data }) {
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
  const { arrayBloques } = useContext(asignContext);
  return (
    <tr>
      {filaAsign.map((asign, i) => {
        const selected = arrayBloques.some(
          (item) => item.dia === i && item.bloque === filaNum + 1
        );
        return (
          <BloqueDispoSala
            key={[filaNum, i - 1]}
            asignacion={asign}
            k={[filaNum, i - 1]}
            selected={selected}
          />
        );
      })}
    </tr>
  );
}
function BloqueDispoSala({ asignacion, k, selected }) {
  const { addBloque } = useContext(asignContext);
  const action = function () {
    if (k[2] !== "none") return;
    const bloque = {
      dia: k[1] + 1,
      bloque: k[0] + 1,
    };
    addBloque(bloque);
  };

  if (asignacion === null) {
    k.push("none");
    return (
      <td
        id={k}
        onClick={action}
        className={selected ? "bloque-seleccionado" : ""}
      >
        SIN ASIGNACION
      </td>
    );
  }
  if (asignacion.bloqueHora) {
    return <td className="horaBloque">{`${asignacion.horaInicio} - ${asignacion.horaTermino}`}</td>;
  }
  k.push(asignacion.cod_ramo);
  return (
    <td
      id={k}
      className={selected ? "asignado bloque-seleccionado" : "asignado"}
      onClick={action}
    >
      {`Código: ${asignacion.cod_ramo}`}
      <br />
      {asignacion.ramo}
      <br />
      {`Grupo: ${asignacion.grupo}`}
      <br />
      {`Profesor: ${asignacion.docente}`}
    </td>
  );
}
