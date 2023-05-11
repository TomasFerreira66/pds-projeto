import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../contexts/ContextProvider.jsx";


export default function ProdutosCliente() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { carrinho, setCarrinho, setNotification } = useStateContext();

  useEffect(() => {
    getProdutos();
  }, []);

  const handleAddToCart = (produto, quantidade) => {
    const index = carrinho.findIndex(item => item.id === produto.id);
    if (index === -1) {
      setCarrinho([...carrinho, { ...produto, quantidade }]);
    } else {
      const updatedCart = [...carrinho];
      updatedCart[index].quantidade += quantidade;
      setCarrinho(updatedCart);
    }
    setNotification(`${produto.nome} adicionado ao carrinho!`);
  };

  const getProdutos = () => {
    setLoading(true);
    axiosClient.get("/produtos")
      .then(({ data }) => {
        setLoading(false);
        setProdutos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <h2>Produtos</h2>
      <br />
      <div className="card-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {produtos.map(produto => (
          <div key={produto.id} className="card animated fadeInDown" style={{ display: "grid", gridTemplateRows: "1fr auto auto", padding: "10px", borderRadius: "10px" }}>
            <div>{produto.nome}</div>
            <div>{produto.descricao}</div>
            <div>{`${produto.preco} €`}</div>
            <div>Quantidade em stock: {produto.quantidade}</div>
            <div>
              <div style={{ display: "flex" }}>
                <input
                  style={{ width: 70, height: 50, marginRight: "10px"}}
                  type="number"
                  min="1"
                  max={produto.quantidade}
                  onChange={e => {
                    const quantidade = parseInt(e.target.value);
                    if (quantidade > produto.quantidade) {
                      setNotification(`Quantidade insuficiente (${produto.quantidade} disponíveis)`);
                    } else {
                      handleAddToCart(produto, quantidade);
                    }
                  }}
                />
                <button style={{width: 120, height: 50}} className="btn-login" onClick={() => handleAddToCart(produto, 1)}>Adicionar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
   
}
