import { useContext, useRef } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

const cargos = {
  DA: "Director de Área",
  JC: "Jefe de Carrera",
  DO: "Docente",
};

const navLinksGen = [
  { bx: "bx-home-alt", to: "/inicio", text: "Home" },
  {
    bx: "bxs-school",
    to: "/inicio/horario-disponible",
    text: "Disponibilidad",
  },
];
const navLinksAdm = [
  {
    bx: "bx-edit-alt",
    to: "/inicio/asignacion",
    text: "Asignación",
  },
  {
    bx: "bxs-school",
    to: "/inicio/malla-curricular",
    text: "Mallas curriculares",
  },
  {
    bx: "bx-chalkboard",
    to: "/inicio/horario-docente",
    text: "Horario Docente",
  },
];

export default function HomeNavbar() {
  const { onLogout, dataUser } = useContext(AuthContext);
  const sidebar = useRef();

  // Toggle click event
  const toggleHandle = () => {
    sidebar.current.classList.toggle("close");
  };
  const linksAdmArray = navLinksAdm.map((navlink, i) => (
    <li className="nav-link" key={i}>
      <NavLink key={i} to={navlink.to} end>
        <i className={`bx ${navlink.bx} icon`}></i>
        <span className="text nav-text">{navlink.text}</span>
      </NavLink>
    </li>
  ));

  return (
    <>
      <nav className="sidebar" ref={sidebar}>
        <header>
          <div className="image-text">
            <span className="image" onClick={toggleHandle}>
              <img src="src/img/utalogo.jpg" alt="logo" />
            </span>

            <div className="text header-text">
              <span className="name">{dataUser.nombre}</span>
              <span className="profession">{cargos[dataUser.cargo_adm]}</span>
            </div>
          </div>
          <i className="bx bx-chevron-right toggle" onClick={toggleHandle}></i>
        </header>
        <div className="menu-bar">
          <div className="menu">
            {/* <li className="search-box">
              <i className="bx bx-search icon"></i>
              <input type="search" placeholder="Search..." />
            </li> */}
            <ul className="menu-links">
              {navLinksGen.map((navlink, i) => (
                <li className="nav-link" key={i}>
                  <NavLink key={i} to={navlink.to} end>
                    <i className={`bx ${navlink.bx} icon`}></i>
                    <span className="text nav-text">{navlink.text}</span>
                  </NavLink>
                </li>
              ))}
              {(['JC', 'DA'].includes(dataUser.cargo_adm) && linksAdmArray)}
            </ul>
          </div>
          <div className="bottom-content">
            <li className="nav-link">
              <Link href="#" onClick={() => onLogout()}>
                <i className="bx bx-log-out icon"></i>
                <span className="text nav-text">Cerrar sesión</span>
              </Link>
            </li>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
