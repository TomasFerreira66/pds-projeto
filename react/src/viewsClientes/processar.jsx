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
  const [currentStep, setCurrentStep] = useState(1);
  const [metodoEnvio, setMetodoEnvio] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const totalSteps = 3;


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

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };
  
  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleMetodoEnvioChange = (event) => {
    setMetodoEnvio(event.target.value);
  };

  const handleMetodoPagamentoChange = (event) => {
    setMetodoPagamento(event.target.value);
  };

  const processOrder = () => {
    if (!metodoEnvio || !metodoPagamento) {
      setNotification('Selecione o método de envio e pagamento.');
      return;
    }

    // Obter os produtos selecionados pelo usuário
    const produtosSelecionados = users.filter(
      (carrinho) => carrinho.idCliente === Number(id)
    );

    const encomenda = {
      idCliente: id,
      idPedido: 1,
      pedidoCliente: 1,
      quantidadePedida: 1,
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

  const renderStep1 = () => {
    return (
      <div>
        <h3>Envio</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
         <label>
            <input
              type="radio"
              name="deliverMethod"
              value="method1"
              checked={metodoEnvio === "method1"}
              onChange={handleMetodoEnvioChange}
            />{" "}
            Domiciliário
          </label>
          <label>
            <input
              type="radio"
              name="deliverMethod"
              value="method2"
              checked={metodoEnvio === "method2"}
              onChange={handleMetodoEnvioChange}
            />{" "}
            Na Loja
          </label>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div>
        <h3>Pagamento</h3>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="method1"
              checked={metodoPagamento === "method1"}
              onChange={handleMetodoPagamentoChange}
            />{" "}
            Visa
            <img
              src="../src/img/visa.png"
              alt="Carrinho"
              width="30"
              height="23"
              className="image-with-border"
            />
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="method2"
              checked={metodoPagamento === "method2"}
              onChange={handleMetodoPagamentoChange}
            />{" "}
            MasterCard
            <img
              src="../src/img/mastercard.png"
              alt="Carrinho"
              width="30"
              height="23"
              className="image-with-border"
            />
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="method3"
              checked={metodoPagamento === "method3"}
              onChange={handleMetodoPagamentoChange}
            />{" "}
            Multibanco
            <img
              src="../src/img/multibanco.png"
              alt="Carrinho"
              width="30"
              height="23"
              className="image-with-border"
            />
          </label>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
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
                  console.log(quantidade);
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
                      <td>{produtoPreco * (quantidade || 1)}€</td>
                    </tr>
                  );
                })}
            </tbody>
          )}
        </table>
      </div>
    );
  };

  const renderSteps = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  const renderNextButton = () => {
    if (currentStep < totalSteps) {
      return (
        <button onClick={handleNextStep} className="btn-finalizar">
          Próximo
        </button>
      );
    }
    return null;
  };

  const renderPreviousButton = () => {
    if (currentStep > 1) {
      return (
        <button onClick={handlePreviousStep} className="btn-finalizar" style={{marginRight: "10px"}}>
          Anterior
        </button>
      );
    }
    return null;
  };

  const renderFinishButton = () => {
    if (currentStep === totalSteps) {
      return (
        <Link to={`/carrinho/${id}`} onClick={processOrder} className="btn-finalizar">
          Finalizar Encomenda
        </Link>
      );
    }
    return null;
  };

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          
        }}
      >
        <h2>Processar Encomenda</h2>
        <Link to={`/carrinho/${id}`} className="btn-finalizar">
          Voltar
        </Link>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <span>Nome: {user.name}</span>
      </div>
      {renderSteps()}
      <div style={{ marginTop: "30px" }}>
        {renderPreviousButton()}
        {renderNextButton()}
        {renderFinishButton()}
      </div>
    </div>
  );
}
