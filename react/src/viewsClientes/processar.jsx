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
  const [metodoEnvio, setMetodoEnvio] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");

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
              preco: nestedData.preco,
              quantidade: nestedData.quantidade,
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

  useEffect(() => {
    getCarrinho();
  }, []);

  const processOrder = () => {
    if (!metodoEnvio || !metodoPagamento) {
      setNotification('Selecione o método de envio e pagamento.');
      return;
    }

    // Obter os produtos selecionados pelo usuário
    const produtosSelecionados = users.filter(
      (carrinho) => carrinho.idCliente === Number(id)
    );

    // Criar um array de objetos com os dados dos produtos selecionados
    const pedidoCliente = produtosSelecionados.map((carrinho) => ({
      idProduto: carrinho.idProduto,
      quantidadePedida: quantidadePedida[carrinho.id] || 1,
    }));

    const encomenda = {
      idCliente: id,
      pedidoCliente: pedidoCliente.map((carrinho) => ({
        idProduto: carrinho.idProduto,
        quantidadePedida: quantidadePedida[carrinho.id] || 1,
      })),
      morada: 'endereco_de_entrega',
      nif: 'nif_cliente',
    };
    

    // Enviar a encomenda para a base de dados de produtos
    axiosClient
      .post('/pedidos', encomenda)
      .then((response) => {
        // Encomenda enviada com sucesso
        setNotification('Encomenda processada e enviada com sucesso!');
        // Redirecionar para a página de confirmação de encomenda, por exemplo:
        // history.push('/confirmacao-encomenda');
      })
      .catch((error) => {
        // Ocorreu um erro ao enviar a encomenda, tratar o erro adequadamente
        console.error('Erro ao enviar a encomenda:', error);
        setNotification('Erro ao enviar a encomenda. Por favor, tente novamente.');
      });
  };

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Checkout</h2>
      </div>
      <div className="card animated fadeInDown" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div>
            <h3>Envio</h3>
            <input
              type="radio"
              name="deliverMethod"
              value="method1"
              checked={metodoEnvio === "method1"}
              onChange={() => setMetodoEnvio("method1")}
            />{" "}
            Domiciliário
            <br />
            <input
              type="radio"
              name="deliverMethod"
              value="method2"
              checked={metodoEnvio === "method2"}
              onChange={() => setMetodoEnvio("method2")}
            />{" "}
            Na Loja
          </div>
        </div>
        <div>
          <div>
            <h3>Pagamento</h3>
            <input
              type="radio"
              name="paymentMethod"
              value="method1"
              checked={metodoPagamento === "method1"}
              onChange={() => setMetodoPagamento("method1")}
            />{" "}
            Visa
            <img src="../src/img/visa.png" alt="Carrinho" width="30" height="23" className="image-with-border" />
            <br />
            <input
              type="radio"
              name="paymentMethod"
              value="method2"
              checked={metodoPagamento === "method2"}
              onChange={() => setMetodoPagamento("method2")}
            />{" "}
            MasterCard
            <img src="../src/img/mastercard.png" alt="Carrinho" width="30" height="23" className="image-with-border" />
            <br />
            <input
              type="radio"
              name="paymentMethod"
              value="method3"
              checked={metodoPagamento === "method3"}
              onChange={() => setMetodoPagamento("method3")}
            />{" "}
            Multibanco
            <img src="../src/img/multibanco.png" alt="Carrinho" width="30" height="23" className="image-with-border" />
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
                    
                    const quantidade = quantidadePedida[carrinho.id];
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
                        <td>{produtoPreco}</td>
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </div>
      </div>

      <button onClick={processOrder} className="btn-finalizar">
        Finalizar Encomenda
      </button>
    </div>
  );
}
