import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect, useState } from "react";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

export default function PaginaMain() {
  const { user, token, setUser, setToken, notification } = useStateContext();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = (ev) => {
    ev.preventDefault();
    setDropdownVisible(!dropdownVisible);
  };

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
        navigate(`agenda/${user.id}`);
        break;
      case "Cliente":
        navigate("/paginainicial");
        break;
      default:
        break;
    }
  }, [user]);

  if (!token) {
    return <Navigate to="/PaginaInicialoriginal" />;
  }

  return (
    <div id="defaultLayout">
      {user.tipo === "admin" && (
        <aside>
          <Link to="/users">Utilizadores</Link>
          <Link to="/stock">Stock</Link>
          <Link to="/pedidos">Pedidos</Link>
          <Link to="/listaProdutos">Produtos</Link>
          <Link to="/verMarcacoes">Marcações</Link>
          <Link to="/estatisticas">Estatísticas</Link>
        </aside>
      )}
      {user.tipo === "Barbeiro" && (
        <aside>
          <Link to={`/agenda/${user.id}`}>Marcações</Link>
        </aside>
      )}
      {user.tipo === "Cliente" && (
        <aside>
          <Link to="/paginainicial">Página Inicial</Link>
          <Link to={`/marcacoes/${user.id}`}>Marcações</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/contactos">Contactos</Link>
        </aside>
      )}
      <div className="content">
        <header>
            <a href="/paginainicial">
            <img
              src="../src/img/IPCA-BarberShop.png"
              alt="Imagem de login"
              className="imagem-login"
              style={{ width: "170px", height: "90px" }}
            />
            </a>
          <div>
            {user.tipo === 'Cliente' && (
              <Link to={`/carrinho/${user.id}`}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'black' }} />
              </Link>
            )}
            &nbsp;&nbsp;&nbsp;
            <button className="no-underline" onClick={toggleDropdown}>
              {user.name}
            </button>
            {dropdownVisible && (
              <div className="dropdown">
                <ul>
                  <li><Link onClick={() => setDropdownVisible(false)} to={'/Perfil/' + user.id}>Definições</Link></li>
                  {user.tipo === 'Cliente' && (
                    <li><Link onClick={() => setDropdownVisible(false)} to={'/historicoEncomendas/' + user.id}>Encomendas</Link></li>
                  )}
                  <li><a onClick={(e) => { onLogout(e); setDropdownVisible(false); }} href="#">Terminar sessão</a></li>
                </ul>
              </div>
            )}
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