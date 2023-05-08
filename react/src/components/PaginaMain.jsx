import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client.js";
import { useEffect } from "react";
import React from "react";

export default function PaginaMain() {
  const { user, token, setUser, setToken, notification } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
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
  // Only return the page if the user is of tipo "admin"
  if (user.tipo == "admin") {

    
    // Navigate to the "/paginainicial" route when the component is rendered
    React.useEffect(() => {
      navigate("/Users");
    }, []);

    return (
      <div id="defaultLayout">
        <aside>
          <Link to="/users">Utilizadores</Link>
          <Link to="/stock">Stock</Link>
          <Link to="/pedidos">Pedidos</Link>
          <Link to="/estatisticas">Estatísticas</Link>
        </aside>
        <div className="content">
          <header>
          <div>
      <img
        src="../src/img/IPCA-BarberShop.png"
        alt="Imagem de login"
        className="imagem-login"
        style={{ width: '170px', height: '90px'}}
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
          {notification && (
            <div className="notification">{notification}</div>
          )}
        </div>
      </div>
    );


  } else if (user.tipo == "Barbeiro") {

    
    // Navigate to the "/paginainicial" route when the component is rendered
    React.useEffect(() => {
      navigate("/marcacoes");
    }, []);

    return (
      <div id="defaultLayout">
        <aside>
          <Link to="/agenda">Marcações</Link>
         
        </aside>
        <div className="content">
          <header>
          <div>
      <img
        src="../src/img/IPCA-BarberShop.png"
        alt="Imagem de login"
        className="imagem-login"
        style={{ width: '170px', height: '90px'}}
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
          {notification && (
            <div className="notification">{notification}</div>
          )}
        </div>
      </div>
    );


  } else if (user.tipo == "Cliente") {

    // Navigate to the "/paginainicial" route when the component is rendered
    React.useEffect(() => {
      navigate("/paginainicial");
    }, []);

    return (
      <div id="defaultLayout">
        <aside>
          <Link to="/paginainicial">Página Inicial</Link>
          <Link to="/marcacoes">Marcações</Link>
          <Link to="/produtos">Produtos</Link>
          <Link to="/contactos">Contactos</Link>
          <Link to="/carrinho">Carrinho</Link>
         
        </aside>
        
        <div className="content">
          
          <header>
          <div>
      <img
        src="../src/img/IPCA-BarberShop.png"
        alt="Imagem de login"
        className="imagem-login"
        style={{ width: '170px', height: '90px'}}
      />
    </div>
  
            <div>
            <a className="no-underline" href="/perfilMain">{user.name}</a>&nbsp; &nbsp;
              <a onClick={onLogout} className="btn-logout" href="#">
                Terminar sessão
              </a>
            </div>
          </header>
          <main>
            <Outlet />
          </main>
          {notification && (
            <div className="notification">{notification}</div>
          )}
        </div>
      </div>
    );

  }
  }

  