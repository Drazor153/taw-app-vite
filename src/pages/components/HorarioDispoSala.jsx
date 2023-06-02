import { useEffect, useState } from "react";
import RamosContainer from "./RamosContainer";

export default function HorarioDispoSala({ ramosExt }) {
  let n_bloques = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const cargarHorarioSala = async (depa, sala) => {
    const response = await fetch(
      import.meta.env.VITE_API_URL +
        "sala?" +
        new URLSearchParams({
          depa,
          sala,
        })
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  };

  return (
    <div id="asignacionP">
      <RamosContainer ramosExt={ramosExt} />
      <div id="asignacionSec">
        <UbiSelectors handler={cargarHorarioSala} />
        <div className="asignacionTable">
          <table>
            <thead style={{ backgroundColor: "#9FC5F8", borderColor: "black" }}>
              <tr>
                <td>Lunes</td>
                <td>Martes</td>
                <td>Miercoles</td>
                <td>Jueves</td>
                <td>Viernes</td>
              </tr>
            </thead>
            <tbody>
              {n_bloques.map((blo) => (
                <tr key={blo}>
                  <BloqueDispoSala key={blo} id={blo} nombre={blo} />
                  <BloqueDispoSala
                    key={blo + 14}
                    id={blo + 14}
                    nombre={blo + 14}
                  />
                  <BloqueDispoSala
                    key={blo + 14 * 2}
                    id={blo + 14 * 2}
                    nombre={blo + 14 * 2}
                  />
                  <BloqueDispoSala
                    key={blo + 14 * 3}
                    id={blo + 14 * 3}
                    nombre={blo + 14 * 3}
                  />
                  <BloqueDispoSala
                    key={blo + 14 * 4}
                    id={blo + 14 * 4}
                    nombre={blo + 14 * 4}
                  />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
function BloqueDispoSala({
  codigo = "",
  nombre = "",
  carrera = "",
  profesor = "",
  id = "",
}) {
  return (
    <td id={id}>
      Código: {codigo}
      <br />
      {nombre}
      <br />
      Carrera: {carrera}
      <br />
      Profesor: {profesor}
    </td>
  );
}

function UbiSelectors({ handler }) {
  // Departamentos Disponibles
  const [depas, setDepas] = useState([]);
  // Salas Disponibles
  const [salas, setSalas] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}ubicaciones`)
      .then((response) => response.json())
      .then((data) => {
        setDepas(data.depas);
        setSalas(data.salas);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Almacena depa escogido
  const [depaInt, setDepaInt] = useState(0);
  // Almacena salas del depa escogido
  const [salaSel, setSalaSel] = useState([]);
  // Almacena sala escogida
  const [salaInt, setSalaInt] = useState(0);

  const handleDepaInt = (e) => {
    const codigo = parseInt(e.target.value);
    setDepaInt(codigo);
    setSalaInt(0);
    if (codigo <= 0) {
      setSalaSel([]);
      return;
    }
    let salas_tmp = salas.filter((val) => val.idDep == codigo);
    setSalaSel(salas_tmp);
  };

  const handleSalaInt = (e) => {
    let codigo = parseInt(e.target.value);
    setSalaInt(codigo);
    handler(depaInt, codigo);
  };

  return (
    <div className="salaSel">
      <div className="sel">
        <label>Departamento:</label>
        <select value={depaInt} onChange={handleDepaInt}>
          <option value={0}>Seleccione un departamento</option>
          {depas.map((depa) => (
            <option key={depa.idDep} value={depa.idDep}>
              {depa.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="sel">
        <label>Sala:</label>
        <select value={salaInt} onChange={handleSalaInt} disabled={depaInt <= 0}>
          <option value={0}>Seleccione una sala</option>
          {salaSel.map((sala) => (
            <option key={sala.idSala} value={sala.idSala}>
              {sala.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
