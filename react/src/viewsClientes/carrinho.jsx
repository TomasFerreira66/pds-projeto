import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Carrinho() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { id } = useParams();
  const { user } = useStateContext();
  const [produtos, setProdutos] = useState({});
  const [quantidadePedida, setQuantidadePedida] = useState({});

  const getCarrinho = () => {
    setLoading(true);
    axiosClient
      .get('/carrinhos')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        getNomeProdutos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getProduto = (idProduto) => {
    axiosClient
      .get(`/produtos/${idProduto}`)
      .then((response) => {
        const { data } = response;
        const nestedData = data.data;
        if (nestedData && nestedData.nome) {
          setProdutos((prevState) => ({
            ...prevState,
            [idProduto]: {
              nome: nestedData.nome,
              quantidade: nestedData.quantidade // Store the quantity value
            },
          }));
        } else {
          console.log(`Product nome not found for idProduto ${idProduto}`);
        }
      })
      .catch((error) => {
        console.log(`Error fetching product data for idProduto ${idProduto}:`, error);
      });
  };

  const getNomeProdutos = (carrinhos) => {
    carrinhos.forEach((carrinho) => {
      const idProduto = carrinho.idProduto;
      if (!produtos[idProduto]) {
        getProduto(idProduto);
        setProdutos((prevState) => ({
          ...prevState,
          [idProduto]: {
            quantidadePedida: carrinho.quantidadePedida, // Store the quantidadePedida value
          },
        }));
      }
    });
  };

  useEffect(() => {
    getCarrinho();
  }, []);

  const onDeleteClick = (carrinho) => {
    if (!window.confirm("De certeza que queres retirar este produto do teu carrinho?")) {
      return;
    }
    axiosClient
      .delete(`/carrinhos/${carrinho.id}`)
      .then(() => {
        setNotification('Produto removido com sucesso');
      });
    getCarrinho();
  };

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Carrinho</h2>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {users
                .filter((carrinho) => carrinho.idCliente === Number(id))
                .map((carrinho) => {
                  const produtoNome = produtos[carrinho.idProduto]?.nome || "";
                  const quantidade = quantidadePedida[carrinho.id];

                  return (
                    <tr key={carrinho.id}>
                      <td>{produtoNome}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <button
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: '1px solid #ccc',
                              backgroundColor: '#fff',
                              fontSize: '14px',
                              cursor: 'pointer',
                            }}
                            onClick={() =>
                              setQuantidadePedida((prevState) => ({
                                ...prevState,
                                [carrinho.id]: Math.max(prevState[carrinho.id] - 1, 1), // Prevent quantity from going below 1
                              }))
                            }
                          >
                            -
                          </button>
                          <span style={{ margin: '0 8px' }}>{quantidade || 1}</span>
                          <button
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: '1px solid #ccc',
                              backgroundColor: '#fff',
                              fontSize: '14px',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const maxQuantity = produtos[carrinho.idProduto]?.quantidade || 1; // Get the maximum quantity from produtos state
                              setQuantidadePedida((prevState) => ({
                                ...prevState,
                                [carrinho.id]: Math.min((prevState[carrinho.id] || 0) + 1, maxQuantity), // Prevent quantity from exceeding maxQuantity
                              }));
                            }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>
                        <button onClick={() => onDeleteClick(carrinho)} className="btn-delete">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          )}
        </table>
      </div>
      <Link to={`/processar/${user.id}`}>
        <button className="btn-processar">Processar encomenda</button>
      </Link>
    </div>
  );
}
