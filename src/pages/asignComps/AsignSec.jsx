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

  // Estados para guardar datos para crear Asignación
  const [docente, setDocente] = useState(0);
  const [bloques, setBloques] = useState([]);
  const [sala, setSala] = useState(0);

  useEffect(() => {
    console.log(ramosNav);
  }, [ramosNav]);

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
    if(source.droppableId === 'ramoElegido'){
      return;
    }
    // Copiar los items de la columna de origen
    const sourceColumn = { ...ramosNav[source.droppableId] };
    const sourceItems = [...sourceColumn.ramos];

    // Copiar los items de la columna de destino
    const destinationColumn = { ...ramosNav[destination.droppableId] };
    const destinationItems = [...destinationColumn.ramos];

    const [returnItem] = destinationItems.splice(0, 1);
    console.log("Return item: ", returnItem);
    // Mover el ítem de origen a la columna de destino
    const [movedItem] = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, movedItem);
    if (returnItem !== undefined) {
      sourceItems.splice(0, 0, returnItem);
    }
    console.log(sourceItems);
    // console.log(ramosNav.listaRamos.ramos);
    // console.log(destinationColumn)
    // console.log(destinationItems)
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
  };
  const handleDragEnd1 = (res) => {
    console.log(res);
  };
  return (
    <div id="asignacionP">
      <DragDropContext onDragEnd={handleDragEnd}>
        <RamosContainer listaRamos={ramosNav.listaRamos.ramos} />
        <DocenteCompt ramoElegido={ramosNav.ramoElegido} />
        <HorarioDispo />
      </DragDropContext>
    </div>
  );
}
