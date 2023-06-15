import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

export default function RamosContainer({ listaRamos }) {
  const [filter, setFilter] = useState("");

  // const lista = listaRamos.filter(
  //   (x) =>
  //     x.codigo.toLowerCase().includes(filter) ||
  //     x.nombre.toLowerCase().includes(filter)
  // );
  // if (lista.length === 0) {
  //   lista.push({ noRes: 1 });
  // }

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

  return (
    <div id="ramosContainer">
      <input
        type="text"
        onChange={(e) => setFilter(e.target.value.toLowerCase())}
        placeholder="Busque ramos por su nombre o código"
      />
      <Droppable droppableId="listaRamos" isDropDisabled={true}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-ramos"
          >
            {listaRamos.map((ramo, i) => {
              // console.log(ramo)
              if (ramo.noRes) {
                return <div key={0}>No se han encontrado coincidencias</div>;
              }
              if (
                ramo.codigo.toLowerCase().includes(filter) ||
                ramo.nombre.toLowerCase().includes(filter)
              ) {
                return (
                  <Draggable
                    key={ramo.codigo}
                    draggableId={ramo.codigo}
                    index={i}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="ramoAsi"
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div className="cab">{ramo.codigo}</div>
                        <div className="cont">
                          {ramo.nombre}
                          <br />
                          {`Semestre ${ramo.numSemestre}`}
                          <br />
                          {`(${ramo.conteo}/${ramo.maxBloques})`}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              }
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
