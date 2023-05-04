import React from 'react';
import { Link } from 'react-router-dom';

export default function PaginaInicial() {
  return (
    <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', height: '15vh' }}>
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
      <br /><br /><br />
      <h3>Barbeiros</h3>
    </div>
  );
}
