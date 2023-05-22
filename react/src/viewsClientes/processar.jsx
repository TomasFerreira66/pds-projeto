import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Processar() {

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
        getPrecoProdutos(data.data);
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
              preco: nestedData.preco,
            },
          }));
        } else {
          console.log(`Product data not found for idProduto ${idProduto}`);
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
      }
    });
  };

  const getPrecoProdutos = (carrinhos) => {
    carrinhos.forEach((carrinho) => {
      const idProduto = carrinho.idProduto;
      if (!produtos[idProduto]) {
        getProduto(idProduto);
      }
    });
  };

  useEffect(() => {
    getCarrinho();
  }, []);


return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>Checkout</h2>
    </div>
    <div className="card animated fadeInDown" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <div>
          <h3>Envio</h3>
          <input type="radio" name="deliverMethod" value="method1" /> Ao domicílio 
          <br />
          <input type="radio" name="deliverMethod" value="method2" /> Recolha na loja
        </div>
        </div>
        <div>
        <div>
          <h3>Pagamento</h3>
          <input type="radio" name="paymentMethod" value="method1" /> Visa
          <img src="../src/img/visa.png" alt="Carrinho" width="30" height="23" className="image-with-border"/>
          <br />
          <input type="radio" name="paymentMethod" value="method2" /> MasterCard
          <img src="../src/img/mastercard.png" alt="Carrinho" width="30" height="23" className="image-with-border"/>
          <br />
          <input type="radio" name="paymentMethod" value="method3" /> Multibanco
          <img src="../src/img/multibanco.png" alt="Carrinho" width="30" height="23" className="image-with-border"/>
        </div>
      </div>
  
      <div>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço</th>
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
                    const produto = produtos[carrinho.idProduto];
                    const produtoNome = produto && produto.nome;
                    const produtoPreco = produto && produto.preco;
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
                          <span style={{ margin: '0 8px' }}>{quantidadePedida[carrinho.id] || 1}</span>
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
                                [carrinho.id]: (prevState[carrinho.id] || 0) + 1,
                              }))
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{produtoPreco} €</td>
                    </tr>
                  );
                })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  
    <button onClick={() => processOrder()} className="btn-finalizar">
      Finalizar encomenda
    </button>
  </div>
  );
}
