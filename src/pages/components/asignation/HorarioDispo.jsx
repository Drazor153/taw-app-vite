import { useContext, useEffect, useState } from "react";
import { asignContext, bloques_hora } from "../../../AuthProvider";

export default function HorarioDispo() {
  const [horario, setHorario] = useState(null);
  const { resetBloques } = useContext(asignContext);

  // if (disponibleDoc.length > 0) {
  //   for (let i = 0; i < matriz.length; i++) {
  //     const fila = matriz[i];
  //     for (let j = 0; j < fila.length; j++) {
  //       const asignacion = fila[j];
  //       const bloqueDispoDoc = disponibleDoc[i][j];
  //       if (bloqueDispoDoc !== null) {
  //         if (!bloqueDispoDoc.usado) {
  //           matriz[i][j] = {
  //             ...asignacion,
  //             bloqueDispo: 1,
  //           };
  //         }
  //       }
  //     }
  //   }
  // }

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
      const matriz = (await response.json()).asignaciones;
      setHorario(matriz);
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
  for (let i = 0; i < data.length; i++) {
    data_local.push([bloques_hora[i], ...data[i]]);
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
  const { arrayBloques, disponibleDoc } = useContext(asignContext);
  // console.log(disponibleDoc);
  return (
    <tr>
      {filaAsign.map((asign, i) => {
        const selected = arrayBloques.some(
          (item) => item.dia === i && item.bloque === filaNum + 1
        );
        let disponible = false;
        if (disponibleDoc.length > 0) {
          const bloqueDispoDoc = disponibleDoc[filaNum][i - 1];
          if (bloqueDispoDoc !== null && bloqueDispoDoc !== undefined) {
            if (!bloqueDispoDoc.usado) {
              disponible = true;
              // console.log(filaNum, i);
            }
          }
        }
        // console.log(disponible, filaNum, i);
        return (
          <BloqueDispoSala
            key={[filaNum, i - 1]}
            asignacion={asign}
            k={[filaNum, i - 1]}
            selected={selected}
            bloqueDispo={disponible}
          />
        );
      })}
    </tr>
  );
}
function BloqueDispoSala({ asignacion, k, selected, bloqueDispo }) {
  const { addBloque, limite } = useContext(asignContext);
  const action = function () {
    if (k[2] !== "none") return;
    if (!bloqueDispo) return;
    const bloque = {
      dia: k[1] + 1,
      bloque: k[0] + 1,
    };
    addBloque(bloque);
  };

  if (asignacion === null) {
    k.push("none");
    // Bloque disponible
    if (bloqueDispo) {
      const classes = ['bloque-disponible'];
      if (limite && !selected){
        classes.push('limite')
      }
      if(selected){
        classes.push('bloque-seleccionado')
      }
      return (
        <td
          onClick={action}
          className={
            classes.join(' ')
          }
        >
          BLOQUE DISPONIBLE
        </td>
      );
    }
    // Bloque vacio
    return <td>SIN ASIGNACION</td>;
  }
  // Bloques izquierdo de hora
  if (asignacion.bloqueHora) {
    return (
      <td className="horaBloque">
        {`${asignacion.bloquesString}`}
        <br />
        {`${asignacion.horaInicio} - ${asignacion.horaTermino}`}
      </td>
    );
  }

  // Bloque con asignacion (Ramo)
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
