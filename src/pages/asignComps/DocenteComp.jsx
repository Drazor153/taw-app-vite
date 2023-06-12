import { Draggable, Droppable } from "react-beautiful-dnd";

export default function DocenteCompt({ ramoElegido }) {
  return (
    <div>
      <h3>Arrastre el ramo que quiera asignar:</h3>
      <Droppable
        droppableId="ramoElegido"
        isDropDisabled={ramoElegido.ramos.length === 1}
      >
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {ramoElegido.ramos.map((ramo, i) => (
              <Draggable key={ramo.codigo} draggableId={ramo.codigo} index={i}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="
                    ramoAsi"
                    style={{
                      userSelect: "none",
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
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div>
        <h3>Profesores que imparten este ramo:</h3>
        <ul>
            <li>a</li>
            <li>a</li>
            <li>a</li>
        </ul>
      </div>
    </div>
  );
}
