import RamosContainer from "./RamosContainer";
import HorarioDispo from "./HorarioDispo";
import { DragDropContext } from "react-beautiful-dnd";
import { useState } from "react";
import DocenteCompt from "./DocenteComp";



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

  // const ramoFilter = (e) => {
  //   const word = e.target.value.toLowerCase();
  //   const lista = ramosExt.filter(
  //     (x) =>
  //       x.codigo.toLowerCase().includes(word) ||
  //       x.nombre.toLowerCase().includes(word)
  //   );
  //   if (lista.length === 0) {
  //     lista.push({ noRes: 1 });
  //   }
  //   setRamosNav(lista);
  // };

  // Estados para guardar datos para crear Asignación
  const [docente, setDocente] = useState(0);
  const [bloques, setBloques] = useState([]);
  const [sala, setSala] = useState(0);

  const handleDragEnd = (result) => {
    console.log(result);
  };
  return (
    <div id="asignacionP">
      <DragDropContext onDragEnd={handleDragEnd}>
        <RamosContainer listaRamos={ramosNav.listaRamos.ramos} />
        <DocenteCompt ramoElegido={columnsData.ramoElegido}/>
      </DragDropContext>
      <HorarioDispo />
    </div>
  );
}
