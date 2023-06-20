import RamosContainer from "./RamosContainer";
import HorarioDispo from "./HorarioDispo";
import { DragDropContext } from "react-beautiful-dnd";
import { useState } from "react";
import DocenteCompt from "./DocenteComp";
import { useEffect } from "react";

export default function AsignSec({ ramosExt }) {
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
  const [docenteArray, setDocenteArray] = useState([]);

  // Estados para guardar datos para crear Asignación
  const [docente, setDocente] = useState(0);
  const [bloques, setBloques] = useState([]);
  const [sala, setSala] = useState(0);

  useEffect(() => {
    const ramoElegido = ramosNav.ramoElegido.ramos[0];
    if (ramoElegido === undefined || docente <= 1000000) {
      return;
    }
    console.log("Ramo y profesor elegidos :D", ramoElegido, docente);
  }, [ramosNav, docente]);

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
  };

  return (
    <div id="asignacionP">
      <DragDropContext onDragEnd={handleDragEnd}>
        <RamosContainer listaRamos={ramosNav.listaRamos.ramos} />
        <DocenteCompt
          ramoElegido={ramosNav.ramoElegido}
          docenteArray={docenteArray}
          docente={docente}
          setDocente={setDocente}
        />
        <HorarioDispo />
      </DragDropContext>
    </div>
  );
}
