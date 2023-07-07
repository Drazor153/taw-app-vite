import { createContext, useContext, useReducer } from "react";

import { AuthContext, bloques_hora } from "../AuthProvider";
import "../styles/horarioDocDispo.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getHorarioDocDispo, postDispo } from "../api/horarioDocDispoApi";

const DocDispoContext = createContext(null);

const buscarBloque = (matriz, bloqueExt) => {
  for (let i = 0; i < matriz.length; i++) {
    const fila = matriz[i];
    for (let j = 0; j < fila.length; j++) {
      const bloqueAsig = fila[j];
      if (bloqueAsig !== null) {
        const coincide =
          bloqueAsig.n_bloque === bloqueExt.bloque &&
          bloqueAsig.num_dia === bloqueExt.dia;
        if (coincide) return true;
      }
    }
  }
  return false;
};

const exists = (lista, obj) => {
  return lista.findIndex(
    (item) => item.dia === obj.dia && item.bloque === obj.bloque
  );
};

const sortDiaBloque = (lista) =>
  lista.sort((a, b) => a.dia - b.dia || a.bloque - b.bloque);

const reducer = (state, action) => {
  const bloque = action.bloque;
  switch (action.type) {
    case "agregar_dispo":
      const index1 = exists(state.bloquesAgreg, bloque);
      if (index1 >= 0) {
        const lista = [...state.bloquesAgreg];
        lista.splice(index1, 1);
        return {
          ...state,
          bloquesAgreg: sortDiaBloque(lista),
        };
      }
      return {
        ...state,
        bloquesAgreg: sortDiaBloque([...state.bloquesAgreg, bloque]),
      };
    case "eliminar_dispo":
      const index2 = exists(state.bloquesElim, bloque);
      if (index2 >= 0) {
        const lista = [...state.bloquesElim];
        lista.splice(index2, 1);
        return {
          ...state,
          bloquesElim: sortDiaBloque(lista),
        };
      }
      return {
        ...state,
        bloquesElim: sortDiaBloque([...state.bloquesElim, bloque]),
      };
    case "reset":
      return {
        bloquesAgreg: [],
        bloquesElim: [],
      };
  }
  throw Error("Unknown action: " + action.type);
};

export default function HorarioDocDispo() {
  const { dataUser } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, {
    bloquesAgreg: [],
    bloquesElim: [],
  });

  const queryClient = useQueryClient();

  const { isLoading, data, isError } = useQuery({
    queryKey: ["horarioDocDispo"],
    queryFn: () => getHorarioDocDispo(dataUser.rut),
  });

  const changeDispos = useMutation({
    mutationFn: postDispo,
    onSuccess: () => {
      alert("Cambios hechos :D");
      dispatch({ type: "reset" });
      queryClient.invalidateQueries("horarioDocDispo");
    },
  });

  const cambio = (bloque) => {
    // Es un bloque disponible, pero no usado
    if (buscarBloque(data.asignaciones, bloque)) {
      dispatch({ type: "eliminar_dispo", bloque });
    } else {
      // Es un bloque libre, para asignar como disponible
      dispatch({ type: "agregar_dispo", bloque });
    }
  };

  const resetArrays = () => {
    dispatch({ type: "reset" });
  };

  const handleSubmit = () => {
    if (state.bloquesAgreg.length === 0 && state.bloquesElim.length === 0)
      return;
    changeDispos.mutate({
      ...state,
      rutDocente: dataUser.rut,
    });
  };

  const dataProvider = {
    ...state,
    cambio,
  };

  const submitSecProps = {
    ...state,
    resetArrays,
    handleSubmit,
  };

  return (
    <DocDispoContext.Provider value={dataProvider}>
      <section className="home">
        <div id="horario-dispo">
          <SubmitSec {...submitSecProps} />
          <div className="horario-in">
            {isLoading ? (
              <div>CARGANDO...</div>
            ) : (
              <HorarioSala matriz={data.asignaciones} />
            )}
          </div>
        </div>
      </section>
    </DocDispoContext.Provider>
  );
}

function SubmitSec({ bloquesAgreg, bloquesElim, resetArrays, handleSubmit }) {
  const submitDisabled = bloquesAgreg.length === 0 && bloquesElim.length === 0;
  return (
    <div className="submit-sec">
      <div className="listas-div">
        <div className="agregados-div">
          <span className="bloques-title">Bloques a agregar:</span>
          <ul>
            {bloquesAgreg.map((bloque, i) => (
              <li key={i}>
                Día: {bloque.dia}, bloque: {bloque.bloque}
              </li>
            ))}
          </ul>
        </div>
        <div className="eliminados-div">
          <span className="bloques-title">Bloques a eliminar:</span>
          <ul>
            {bloquesElim.map((bloque, i) => (
              <li key={i}>
                Día: {bloque.dia}, bloque: {bloque.bloque}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="submit-div">
        <button onClick={resetArrays}>Reiniciar selección</button>
        <button onClick={handleSubmit} disabled={submitDisabled}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

function HorarioSala({ matriz }) {
  const data_local = [];
  for (let i = 0; i < matriz.length; i++) {
    data_local.push([bloques_hora[i], ...matriz[i]]);
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
  const { bloquesAgreg, bloquesElim } = useContext(DocDispoContext);
  return (
    <tr>
      {filaAsign.map((asign, i) => {
        let selected = "";
        if (
          bloquesAgreg.some(
            (item) => item.dia === i && item.bloque === filaNum + 1
          )
        ) {
          selected = "agregar";
        } else if (
          bloquesElim.some(
            (item) => item.dia === i && item.bloque === filaNum + 1
          )
        ) {
          selected = "eliminar";
        }
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
  const { cambio } = useContext(DocDispoContext);
  const action = function () {
    if (!(k[2] === "none" || k[2] === 0)) return;
    const bloque = {
      dia: k[1] + 1,
      bloque: k[0] + 1,
    };
    cambio(bloque);
  };

  if (asignacion === null) {
    k.push("none");
    const props = {
      id: k,
      onClick: action,
    };
    selected ? (props.className = selected) : "";
    return <td {...props}>BLOQUE LIBRE</td>;
  }
  if (asignacion.bloqueHora) {
    return (
      <td className="horaBloque">
        {`${asignacion.bloquesString}`}
        <br />
        {`${asignacion.horaInicio} - ${asignacion.horaTermino}`}
      </td>
    );
  }

  if (!asignacion.usado) {
    k.push(asignacion.usado);
    return (
      <td
        className={`no-usado${selected ? ` ${selected}` : ""}`}
        id={k}
        onClick={action}
      >
        SIN ASIGNACION
      </td>
    );
  }

  k.push(asignacion.cod_ramo);
  return (
    <td
      id={k}
      className={`asignado ${selected ? selected : ""}`}
      onClick={action}
    >
      {`Código: ${asignacion.cod_ramo}`}
      <br />
      {asignacion.ramo}
      <br />
      {`Grupo: ${asignacion.grupo}`}
      <br />
      {`${asignacion.sala}`}
    </td>
  );
}
