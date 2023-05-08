import React, { useState } from 'react';
import Carrinho from './carrinho';

const Produtos = () => {
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  }

  const produtos = [
   
  ];

  return (
    <div>
      <h1>Produtos</h1>
      <ul>
        {produtos.map((produto, index) => (
          <li key={index}>
            <p>{produto.nome}</p>
            <p>Quantidade disponível: {produto.quantidade}</p>
            <p>Preço: R$ {produto.preco}</p>
            <button onClick={() => adicionarAoCarrinho(produto)}>Adicionar ao carrinho</button>
          </li>
        ))}
      </ul>
      <button onClick={() => console.log(carrinho)}>Ver carrinho</button>
      <button onClick={() => setCarrinho([])}>Limpar carrinho</button>
      {carrinho.length > 0 && <Carrinho carrinho={carrinho} />}
    </div>
  );
}

export default Produtos;

