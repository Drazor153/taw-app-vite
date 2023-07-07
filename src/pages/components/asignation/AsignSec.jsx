import RamosContainer from "./RamosContainer";
import HorarioDispo from "./HorarioDispo";
import { DragDropContext } from "react-beautiful-dnd";
import { useEffect, useState, useRef } from "react";
import DocenteCompt from "./DocenteComp";
import { asignContext } from "../../../AuthProvider";
import { getHorarioDocDispo } from "../../../api/horarioDocDispoApi";

export default function AsignSec({ ramosExt, reload, numSemestres }) {
  // Objeto para DnD
  const columnsData = {
    listaRamos: {
      ramos: [...ramosExt],
    },
    ramoElegido: {
      ramos: [],
    },
  };
  const [ramosNav, setRamosNav] = useState(columnsData);
  const ramoElegido = ramosNav.ramoElegido.ramos[0];
  const [docenteArray, setDocenteArray] = useState([]);

  // Estados para guardar datos para crear Asignación
  const [docente, setDocente] = useState(0);
  const [disponibleDoc, setDisponibleDoc] = useState([]);
  const [bloques, setBloques] = useState([]);

  const [limite, setLimite] = useState(false);
  const sala = useRef();

  const cambioDocente = async (rut) => {
    const matriz = await getHorarioDocDispo(rut);
    setDocente(rut);
    setDisponibleDoc(matriz.asignaciones);
  };

  const [asignDisabled, setAsignDisabled] = useState(true);
  const exists = (obj) => {
    return bloques.findIndex(
      (item) => item.dia === obj.dia && item.bloque === obj.bloque
    );
  };

  const addBloque = (bloque) => {
    if (ramoElegido === undefined) return false;

    setLimite(false);

    const index = exists(bloque);
    if (index >= 0) {
      const lista = [...bloques];
      lista.splice(index, 1);
      setBloques(lista);
      return false;
    }
    if (bloques.length >= ramoElegido.maxBloques - ramoElegido.conteo) {
      setLimite(true);
      return false;
    }
    const lista = [...bloques, bloque];
    setBloques(lista);
    if (lista.length >= ramoElegido.maxBloques - ramoElegido.conteo) {
      setLimite(true);
    }
    return true;
  };
  const resetBloques = () => {
    setBloques([]);
  };

  useEffect(() => {
    if (ramoElegido === undefined || docente <= 1000000 || bloques.length < 1) {
      setAsignDisabled(true);
      return;
    }
    setAsignDisabled(false);
  }, [ramoElegido, docente, bloques]);

  const submitAsignacion = async () => {
    if (ramoElegido === undefined || docente <= 1000000 || bloques.length < 1) {
      return;
    }
    const asignacion = {
      codigoRamo: ramoElegido.codigo,
      profesor: docente,
      bloques,
      salaRef: sala.current,
    };
    const url = import.meta.env.VITE_API_URL + "asignacion";
    const requestOptions = {
      method: "POST",
      // credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asignacion),
    };
    try {
      const response = await fetch(url, requestOptions);
      if (response.ok) {
        const text = await response.json();
        resetBloques();
        setDocente();
        alert(text.res);
        reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // Si el ítem se suelta fuera de una columna droppable o en la misma posición, no hacemos nada
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }
    if (source.droppableId === "ramoElegido") {
      return;
    }
    // Copiar los items de la columna de origen
    const sourceColumn = { ...ramosNav[source.droppableId] };
    const sourceItems = [...sourceColumn.ramos];

    // Copiar los items de la columna de destino
    const destinationColumn = { ...ramosNav[destination.droppableId] };
    const destinationItems = [...destinationColumn.ramos];

    const [returnItem] = destinationItems.splice(0, 1);
    // Mover el ítem de origen a la columna de destino
    const [movedItem] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, movedItem);
    if (returnItem !== undefined) {
      sourceItems.splice(0, 0, returnItem);
    }

    // Actualizar el estado con las columnas y los items modificados
    setRamosNav({
      ...ramosNav,
      [source.droppableId]: {
        ...sourceColumn,
        ramos: sourceItems,
      },
      [destination.droppableId]: {
        ...destinationColumn,
        ramos: destinationItems,
      },
    });

    // Obtener profesores que imparten el ramo
    const ramoEscogido = destinationItems[0];
    fetch(
      `${import.meta.env.VITE_API_URL}getprofesores?` +
        new URLSearchParams({ ramoEscogido: ramoEscogido.codigo })
    )
      .then((response) => response.json())
      .then((data) => {
        setDocenteArray(data);
      });

    setDocente(0);
    setBloques([]);
    setDisponibleDoc([]);

    fetch(
      `${import.meta.env.VITE_API_URL}asignaciones-ramo?` +
        new URLSearchParams({
          codRamo: ramoEscogido.codigo,
        })
    )
      .then((response) => response.json())
      .then((ramo) => {
        setLimite(ramo.conteo >= ramo.max_bloques);
      });
  };
  const dataProvider = {
    addBloque,
    resetBloques,
    arrayBloques: bloques,
    salaRef: sala,
    disponibleDoc,
    limite,
  };

  return (
    <asignContext.Provider value={dataProvider}>
      <div id="asignacionP">
        <DragDropContext onDragEnd={handleDragEnd}>
          <RamosContainer
            listaRamos={ramosNav.listaRamos.ramos}
            totalSemestres={numSemestres}
          />
          <div className="btnDiv">
            <button
              className="button"
              onClick={submitAsignacion}
              disabled={asignDisabled}
            >
              Enviar asignación
            </button>
          </div>
          <div className="asignP1">
            <DocenteCompt
              ramoElegido={ramosNav.ramoElegido}
              docenteArray={docenteArray}
              docenteSelected={docente}
              setDocente={cambioDocente}
            />
            <HorarioDispo setBloques={setBloques} />
          </div>
        </DragDropContext>
      </div>
    </asignContext.Provider>
  );
}
