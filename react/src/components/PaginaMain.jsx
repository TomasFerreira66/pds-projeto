import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect } from "react";
import React from "react";

export default function PaginaMain() {
  const { user, token, setUser, setToken, notification } = useStateContext();

  if (!token) {
    return <Navigate to="/PaginaInicialoriginal" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    switch (user.tipo) {
      case "admin":
        navigate("/Users");
        break;
      case "Barbeiro":
        navigate("/agenda");
        break;
      case "Cliente":
        navigate("/paginainicial");
        break;
      default:
        break;
    }
  }, [user]);

  return (
    <div id="defaultLayout">
      {user.tipo === "admin" && (
        <aside>
          <Link to="/users">Utilizadores</Link>
          <Link to="/stock">Stock</Link>
          <Link to="/pedidos">Pedidos</Link>
          <Link to="/estatisticas">Estatísticas</Link>
        </aside>
      )}
      {user.tipo === "Barbeiro" && (
        <aside>
          <Link to="/agenda">Marcações</Link>
        </aside>
      )}
      {user.tipo === "Cliente" && (
        <aside>
          <Link to="/paginainicial">Página Inicial</Link>
          <Link to="/marcacoes">Marcações</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/contactos">Contactos</Link>
          <Link to="/carrinho">Carrinho</Link>
          <Link to="/perfilMain">Editar Perfil</Link>
        </aside>
        
      )}
      <div className="content">
        <header>
          <div>
            <img
              src="../src/img/IPCA-BarberShop.png"
              alt="Imagem de login"
              className="imagem-login"
              style={{ width: "170px", height: "90px" }}
            />
          </div>
          
          <div>
            {user.name} &nbsp; &nbsp;
            <a onClick={onLogout} className="btn-logout" href="#">
              Terminar sessão
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  );
}
