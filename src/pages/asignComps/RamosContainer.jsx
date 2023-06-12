import { Draggable, Droppable } from "react-beautiful-dnd";

export default function RamosContainer({ listaRamos }) {

  return (
    <div id="ramosContainer">
      <input
        type="text"
        // onInput={ramoFilter}
        placeholder="Busque ramos por su nombre o código"
      />
      <Droppable droppableId="ramosCont">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex-ramos"
          >
            {listaRamos.map((ramo, i) => {
              if (ramo.noRes) {
                return <div key={0}>No se han encontrado coincidencias</div>;
              }
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
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
