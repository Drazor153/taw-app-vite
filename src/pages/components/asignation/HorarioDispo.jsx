import { useContext, useEffect, useState } from "react";
import { asignContext } from "../../../AuthProvider";

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
  const n_bloques = [];
  for (let i = 1; i <= data.bpd; i++) {
    n_bloques.push(i);
  }

  const data_local = [...data.asignaciones];
  // console.log(data_local);
  return (
    <div className="horario" id="horarioAsign">
      <table>
        <thead>
          <tr>
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
      {filaAsign.map((asign, i) => (
        <BloqueDispoSala
          key={[filaNum, i]}
          asignacion={asign}
          k={[filaNum, i]}
        />
      ))}
    </tr>
  );
}
function BloqueDispoSala({ asignacion, k }) {
  const { addBloque } = useContext(asignContext);

  const action = () => {
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
      <td id={k} onClick={action}>
        SIN ASIGNACION
      </td>
    );
  }
  k.push(asignacion.cod_ramo);
  return (
    <td id={k} className="asignado" onClick={action}>
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
