import React from 'react';
import { Link } from 'react-router-dom';
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";

export default function PaginaInicial() {
    const [barbeiros, setBarbeiros] = useState([]);
  
    useEffect(() => {
      getBarbeiros();
    }, [])
  
    const getBarbeiros = () => {
      axiosClient.get('/users')
        .then(({ data }) => {
          const barbeirosList = data.data.filter(user => user.tipo === 'Barbeiro');
          setBarbeiros(barbeirosList);
        })
        .catch(() => {
        })
    }
  
    return (
      <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '10vh' }}>
          <Link to="/marcacoes" className='no-underline' >
            <button className="btn-marcacao">FAZER MARCAÇÃO</button>
          </Link>
        </div>
        <h3>Produtos</h3><br /><br />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '30vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '45%' }}>
            <img
              src="../src/img/cabelo.png"
              alt="cabelo"
              className="imagem-cabelo"
            />
            <br />
            <h4>Cabelo</h4>
            <br />
            <Link to="/produtos" className='no-underline' >
              <button className="btn-comprar">Comprar</button>
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '45%' }}>
            <img
              src="../src/img/barba.png"
              alt="barba"
              className="imagem-barba"
            />
            <br />
            <h4>Barba</h4>
            <br />
            <Link to="/produtos" className='no-underline' >
              <button className="btn-comprar">Comprar</button>
            </Link>
          </div>
        </div>
        <br /><br />
        <h3>Barbeiros</h3>
        <ul>
            {barbeiros.map((barbeiro, index) => (
                <li key={index}>{barbeiro.name}</li>
            ))}
        </ul>

      </div>
    );
  }