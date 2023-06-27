const romanize =  (num) => {
  if (isNaN(num))
      return NaN;
  var digits = String(+num).split(""),
      key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
             "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
             "","I","II","III","IV","V","VI","VII","VIII","IX"],
      roman = "",
      i = 3;
  while (i--)
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

export default function MallaComponent({ramos}) {

  // THeaders
  const totalSemestres = ramos.reduce(
    (max, obj) => (obj.numSemestre > max ? obj.numSemestre : max),
    ramos[0].numSemestre
  );
  const ths = [];
  for (let i = 1; i <= totalSemestres; i++) {
    ths.push(<th key={i}>{romanize(i)}</th>);
  }

  // TRows
  const cantidad_mayor = ramos.reduce(
    (max, obj) => (obj.pos > max ? obj.pos : max),
    ramos[0].pos
  );
  const trows = [];
  for (let i = 1; i <= cantidad_mayor; i++) {
    const arr = new Array(totalSemestres).fill(null);
    ramos
      .filter((val) => val.pos === i)
      .map((val) => {
        arr[val.numSemestre - 1] = val;
        return 0;
      });
    trows.push(<RowBloques key={i} arrayRamos={arr} width={totalSemestres} />);
  }

  return (
    <div className="horario">
      <table>
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>{trows}</tbody>
      </table>
    </div>
  );
}

function RowBloques({ arrayRamos }) {
  return (
    <tr>
      {arrayRamos.map((ramo, i) => {
        if (ramo === null) {
          return <BloqueCarrera key={i} />;
        } else {
          return (
            <BloqueCarrera
              {...ramo}
              key={i}
              valido
            />
          );
        }
      })}
    </tr>
  );
}

function BloqueCarrera({
  codigo,
  nombre,
  numSemestre,
  maxBloques,
  id,
  conteo,
  valido,
}) {
  if (valido) {
    return (
      <td id={id} className="valido" title={nombre}>
        {codigo}
        <br />
        {nombre}
        <br />
        Semestre {numSemestre}
        <br />
        {`(${conteo}/${maxBloques})`}
        
      </td>
    );
  } else {
    return <td></td>;
  }
}
