import { NavLink, Outlet, Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useAuth } from "../../AuthProvider";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

export default function HomeNavbar() {
  const { onLogout, dataUser } = useAuth();
  const nombre = dataUser.nombre;
  let cargo;
  switch (dataUser.cargo_adm) {
    case "da":
      cargo = "Director de Área";
      break;
    case "jc":
      cargo = "Jefe de Carrera";
      break;
    default:
      cargo = "Docente";
      break;
  }

  const navLinks = [
    { to: "/home_user", text: "Home" },
    { to: "/home_user/asignacion", text: "Asignacion" },
    { to: "/home_user/horario", text: "Mallas curriculares" },
  ];
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };
  const hideNavbar = () => {
    navRef.current.classList.remove("responsive_nav");
  };

  const [isSubMenu, setSubMenu] = useState(false);
  const toggleSubMenu = () => {
    setSubMenu(isSubMenu === false ? true : false);
  };

  let boxClassSubMenu = ["dropdown-btn "];

  if (isSubMenu) {
    boxClassSubMenu.push("dropdown-active");
  }

  return (
    <>
      <header>
        <h3>Logo</h3>
        <nav ref={navRef}>
          {navLinks.map((el, i) => (
            <NavLink key={i} to={el.to} end onClick={hideNavbar}>
              {el.text}
            </NavLink>
          ))}
          <div
            onClick={toggleSubMenu}
            // onBlur={() => setSubMenu(false)}
            className={boxClassSubMenu.join(" ")}
          >
            <Link to="#">{`${nombre} (${cargo})`}</Link>
            <NavLink to={"/home_user/account"}>Perfil</NavLink>
            <Link
              onClick={() => {
                onLogout();
              }}
              to="#"
            >
              Log out
            </Link>
          </div>
          <button className="nav-btn nav-close-btn" onClick={showNavbar}>
            <AiOutlineClose />
          </button>
        </nav>
        <button className="nav-btn" onClick={showNavbar}>
          <AiOutlineMenu />
        </button>
      </header>
      <Outlet />
    </>
  );
}
