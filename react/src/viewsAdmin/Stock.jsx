import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Stock() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantidadeInput, setQuantidadeInput] = useState('');

  useEffect(() => {
    getProdutos();
  }, []);

  const getProdutos = () => {
    setLoading(true);
    const url = '/produtos';
    axiosClient.get(url)
      .then(({ data }) => {
        const produtosFiltrados = data.data.filter(produto => produto.quantidade <= 5);
        setLoading(false);
        setProdutos(produtosFiltrados);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  const handleQuantidadeChange = (event) => {
    setQuantidadeInput(event.target.value);
  };

  const handleAtualizarQuantidade = (produtoId) => {
    const quantidade = parseInt(quantidadeInput);
    if (!isNaN(quantidade)) {
      const url = `/produtos/${produtoId}`;
      axiosClient.get(url)
        .then(({ data }) => {
          const quantidadeExistente = data.data.quantidade;
          const novaQuantidade = quantidadeExistente + quantidade;
          axiosClient.patch(url, { quantidade: novaQuantidade })
            .then(() => {
              const updatedProdutos = produtos.map(produto => {
                if (produto.id === produtoId) {
                  return {
                    ...produto,
                    quantidade: novaQuantidade
                  };
                }
                return produto;
              });
              setProdutos(updatedProdutos);
              setQuantidadeInput('');
            })
        })
    }
  };

  return (
    <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h2>Stock</h2>
        <div>
        </div>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Tipo</th> 
            <th>Ações</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="6" className="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {produtos.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.id}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>{`${produto.preco} €`}</td>
                  <td>{produto.quantidade}</td>
                  <td>{produto.tipo}</td>
                  <td>
                    <input
                        style={{ width: 70, height: 20, marginRight: 10}}
                      type="number"
                      min="0"
                      value={quantidadeInput}
                      onChange={handleQuantidadeChange}
                    />
                    <button onClick={() => handleAtualizarQuantidade(produto.id)} className="btn-edit">Adicionar</button>
                  </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )}
