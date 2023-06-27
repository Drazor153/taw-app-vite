import { Draggable, Droppable } from "react-beautiful-dnd";

export default function DocenteCompt({
  ramoElegido,
  docenteArray,
  setDocente,
  docenteSelected,
}) {
  return (
    <div id="docenteComp">
      <h3>Arrastre el ramo que quiera asignar:</h3>
      <Droppable
        droppableId="ramoElegido"
        // isDropDisabled={ramoElegido.ramos.length === 1}
        direction="row"
      >
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            id="ramoElegido"
          >
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
        <div className="docente-list">
          {docenteArray.map((docenteObj) => (
            <DocenteItem
              key={docenteObj.rut}
              {...docenteObj}
              set={setDocente}
              selected={docenteSelected === docenteObj.rut}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DocenteItem({ nombre, rut, set, selected}) {
  const handler = () => {
    set(rut);
  };
  const classesList = ["docente-item"];
  if(selected){
   classesList.push('docente-selected') 
  }
  return (
    <div id={rut} className={classesList.join(" ")} onClick={handler}>
      {nombre}
    </div>
  );
}
