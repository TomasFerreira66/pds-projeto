import React from 'react';
import { Link } from 'react-router-dom';
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";

export default function PaginaInicialoriginal() {
    const [barbeiros, setBarbeiros] = useState([]);
  
    useEffect(() => {
      getBarbeiros();
    }, [])
  
    const getBarbeiros = () => {
      axiosClient.get('/users')
        .then(({ data }) => {
          const barbeirosList = data.data.filter(user => user.tipo === 'Barbeiro').map(barbeiro => ({
            ...barbeiro,
            imgUrl: `../src/img/${barbeiro.id}.png`
          }));
          setBarbeiros(barbeirosList);
        })
        .catch(() => {
        })
    }    
    
  
    return (

      <div id="defaultLayout">
        <aside>
          <Link to="/paginainicial">Página Inicial</Link>
          <Link to="/login">Marcações</Link>
          <Link to="/login">Produtos</Link>
          <Link to="/contactosguest">Contactos</Link>
        </aside>
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
          
          
          <Link to="/login">
          <button className="btn-login">Iniciar sessão</button>
        </Link>
        </header>


      <div className='card animated fadeInDown' style={{ marginLeft: '100px' , marginRight: '100px'}}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '10vh' }}>
        <Link to={`/login`}>
            <button className="btn-marcacao">FAZER MARCAÇÃO</button>
          </Link>
        </div>
        <h3>Produtos</h3><br /><br />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '30vh' }}>
          <div className='card animated fadeInDown' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '45%' }}>
            <img
              src="../src/img/cabelo.png"
              alt="cabelo"
              className="imagem-cabelo"
            />
            <br />
            <h4>CABELO</h4>
            <br />
            <Link to="/login">
              <button className="btn-comprar">Comprar</button>
            </Link>
          </div>
          <div className='card animated fadeInDown' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '45%' }}>
            <img
              src="../src/img/barba.png"
              alt="barba"
              className="imagem-barba"
            />
            <br />
            <h4>BARBA</h4>
            <br />
            <Link to="/login">
              <button className="btn-comprar">Comprar</button>
            </Link>
          </div>
        </div>
        <br /><br />
        <h3>Barbeiros</h3>
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          {barbeiros.map((barbeiro, index) => (
            <div className='card animated fadeInDown' key={index} style={{ width: '48%', marginBottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img className='img-barbeiro' src={barbeiro.imgUrl} alt={barbeiro.name}/>
            <h4 style={{ marginTop: '10px' }}>{barbeiro.name}</h4>
          </div>                   
          ))}
        </div>
      </div>
      </div>
      </div>
    );
    
  }

