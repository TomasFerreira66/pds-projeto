import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import { createRef } from "react";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { useState } from "react";

export default function Login() {
  const emailRef = createRef();
  const passwordRef = createRef();
<<<<<<< Updated upstream
  const tipoRet = createRef();
=======
>>>>>>> Stashed changes
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    setErrors(null);
    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
<<<<<<< Updated upstream
        setUser(data.user);
        setToken(data.token);
        if (data.user.tipo === "admin") {
          // Redirect to PaginaAdmin if tipo is admin
          navigate("/users");
        } else if (data.user.tipo === "Barbeiro") {
          // Redirect to PaginaBarbeiro if tipo is barbeiro
          navigate("/barbeiro");
=======
        // Verifique se o tipo do usuário é "admin"
        if (data.user.tipo === "admin") {
          setUser(data.user);
          setToken(data.token);
        } else {
          setErrors({ auth: ["Acesso negado"] });
>>>>>>> Stashed changes
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message],
            });
          }
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <img
            src="../src/img/IPCA-BarberShop.png"
            alt="Imagem de login"
            className="imagem-login"
          />
          <h1 className="title">Iniciar sessão</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Palavra-passe" />
          <button className="btn btn-block">Seguinte</button>
          <p className="message">
            Não tem conta? <Link to="/signup">Criar conta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
