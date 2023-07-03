import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

export default function RamosContainer({ listaRamos, totalSemestres }) {
  const [filter, setFilter] = useState("");
  const [filterSemestre, setFilterSemestre] = useState(0);

  const opciones_semestre = [];
  for (let i = 1; i <= totalSemestres; i++) {
    opciones_semestre.push(<option key={`sem-${i}`} value={i}>{`Semestre ${i}`}</option>);
  }

  return (
    <div id="ramosContainer">
      <div className="filtros">
        <input
          className="filter-nombre-codigo"
          type="text"
          onChange={(e) => setFilter(e.target.value.toLowerCase())}
          placeholder="Busque ramos por su nombre o código"
        />
        <select
          className="filter-semestre"
          value={filterSemestre}
          onChange={(e) => setFilterSemestre(parseInt(e.target.value))}
        >
          <option value={0}>Todos los semestres</option>
          {opciones_semestre}
        </select>
      </div>
      <Droppable droppableId="listaRamos" isDropDisabled={true} direction="row">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-ramos"
          >
            {listaRamos.map((ramo, i) => {
              // console.log(filterSemestre)
              if (ramo.noRes) {
                return <div key={0}>No se han encontrado coincidencias</div>;
              }
              if (filterSemestre != 0 && ramo.numSemestre !== filterSemestre) {
                return;
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
