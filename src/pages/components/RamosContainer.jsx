import { useState } from "react";

export default function RamosContainer({ ramosExt }) {
  const [ramosNav, setRamosNav] = useState([...ramosExt]);

  const sortedRamos = [...ramosNav].sort(
    (a, b) => a.numSemestre - b.numSemestre
  );
  const ramoFilter = (e) => {
    const word = e.target.value.toLowerCase();
    const lista = ramosExt.filter(
      (x) =>
        x.codigo.toLowerCase().includes(word) ||
        x.nombre.toLowerCase().includes(word)
    );
    if (lista.length === 0) {
      lista.push({ noRes: 1 });
    }
    setRamosNav(lista);
  };

  const handleRamo = (codigo) => {
    console.log(codigo);
  };

  return (
    <div id="ramosContainer">
      <input
        type="text"
        onInput={ramoFilter}
        placeholder="Busque ramos por su nombre o código"
      />
      <div className="flex-ramos">
        {sortedRamos.map((val) => (
          <RamoAsi key={val.codigo} {...val} action={handleRamo} />
        ))}
      </div>
    </div>
  );
}

function RamoAsi({ codigo, nombre, numSemestre, maxBloques, action, noRes }) {
  const handle = () => {
    action(codigo);
  };

  if (noRes) {
    return <div>No se han encontrado coincidencias</div>;
  } else {
    return (
      <div id={codigo} className="ramoAsi">
        <div className="cab">{codigo}</div>
        <div className="cont">
          {nombre}
          <br />
          {`Semestre ${numSemestre}`}
          <br />
          {`(0/${maxBloques})`}
        </div>
        <div className="foot">
          <button type="button" onClick={handle}>
            Select
          </button>
        </div>
      </div>
    );
  }
}
