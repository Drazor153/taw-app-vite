import { useRef, useState } from "react";
import { useAuth } from "../AuthProvider";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import logo from "../img/utalogo.jpg";

var Fn = {
  // Valida el rut con su cadena completa "XXXXXXXX-X"
  validaRut: function (rutCompleto) {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) return false;
    var tmp = rutCompleto.split("-");
    var digv = tmp[1];
    var rut = tmp[0].split(".").join("");
    if (digv === "K") digv = "k";
    return Fn.dv(rut) === digv;
  },
  dv: function (T) {
    var M = 0,
      S = 1;
    for (; T; T = Math.floor(T / 10)) S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
    return String(S ? S - 1 : "k");
  },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const rutRef = useRef(null);
  const [rut, setRut] = useState("");
  const passRef = useRef(null);
  const { onLogin } = useAuth();
  const [alert, setAlert] = useState(<></>);

  const modAlert = (tipo, text) => {
    setAlert(<Alert type={tipo} message={text} />);
  };

  const rutHandleFocus = (e) => {
    e.target.value = rut;
  };

  const rutHandleBlur = (e) => {
    let str = e.target.value;
    setRut(str);
    let str1 = str.replace(/^(\d{1,2})(\d{3})(\d{3})(\w{1})$/, "$1$2$3-$4");
    e.target.value = str1;
    rutRef.current = str1;
  };

  const propRut = { onFocus: rutHandleFocus, onBlur: rutHandleBlur };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rut = rutRef.current;
    const password = passRef.current.value;

    if (!Fn.validaRut(rut)) {
      modAlert("error", "Por favor, escriba su rut correctamente");
      return;
    }
    modAlert("info", "Espere un momento...");
    const res = await onLogin({ rut, password });
    if (res.success) {
      modAlert("success", "Has iniciado sesion correctamente");
      // const origin = location.state?.from?.pathname || "/home_user";
      navigate("/home_user");
    } else {
      modAlert("error", "Credenciales incorrectas");
    }
  };
  return (
    <div id="login">
      <div className="login-box">
        <div className="login-header">Bienvenido</div>
        <form>
          <div className="input-box">
            <input
              type="text"
              className="input-field"
              placeholder="Rut"
              maxLength={9}
              {...propRut}
            />
            <label>Con digito verificador sin guión (Ej: 123456789)</label>
          </div>
          <div className="input-box">
            <input
              type="password"
              className="input-field"
              placeholder="Contraseña"
              ref={passRef}
            />
          </div>
          <div className="forgot">
            <div>
              <input type="checkbox" id="log-check" />
              <label>Recordar rut</label>
            </div>
            <div>
              <Link href="#">Olvide mi contraseña</Link>
            </div>
          </div>
          <div className="input-submit">
            <button className="submit-btn" onClick={handleSubmit}>
              Iniciar sesion
            </button>
          </div>
        </form>
        {alert}

        {/* <div className="sign-up-link">
          <p>
            No tienes una cuenta? <a href="#">Registrarse</a>
          </p>
        </div> */}
      </div>
    </div>
  );
}

function Alert({ type, message }) {
  const classNames = ["alert", type];
  return <div className={classNames.join(" ")}>{message}</div>;
}
