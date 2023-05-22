import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Stock() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantidades, setQuantidades] = useState({});

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

  const handleQuantidadeChange = (event, produtoId) => {
    const value = event.target.value;
    setQuantidades(prevQuantidades => ({
      ...prevQuantidades,
      [produtoId]: value
    }));
  };

  const handleAtualizarQuantidade = (produtoId) => {
    const quantidade = parseInt(quantidades[produtoId]);
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
            setQuantidades(prevQuantidades => ({
              ...prevQuantidades,
              [produtoId]: '' // Limpa a quantidade do produto após atualização
            }));
          })
      });
  };

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h2>Stock</h2>
        <div>
        </div>
      </div>
      &nbsp;
      <div className="card-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {produtos.map(produto => (
          <div key={produto.id} className="card animated fadeInDown" style={{ padding: "10px", borderRadius: "10px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "10px" }}>{produto.nome}</div>
            <div>Quantidade em stock: {produto.quantidade}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <input
                style={{ width: 70, height: 40, marginRight: 10 }}
                type="number"
                min="0"
                value={quantidades[produto.id] || ''}
                onChange={(event) => handleQuantidadeChange(event, produto.id)}
              />
              <button style={{ height: 40 }} onClick={() => handleAtualizarQuantidade(produto.id)} className="btn-edit">Adicionar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
