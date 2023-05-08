import React from 'react';
const Carrinho = ({ carrinho }) => {
  return (
    <div>
      <h1>Carrinho</h1>
      <ul>
        {carrinho.map((produto, index) => (
          <li key={index}>
            <p>{produto.nome}</p>
            <p>Quantidade: 1</p>
            <p>Preço: R$ {produto.preco}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Carrinho;

