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
      <div className="card animated fadeInDown" style={{ display: "grid", gridTemplateColumns: "50% 50%", gap: "10px" }}>
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {!loading && (
          <>
            {produtos.map(produto => (
              <div key={produto.id} style={{ display: "grid", gridTemplateRows: "1fr auto auto", border: "1px solid gray", padding: "10px", borderRadius: "5px" }}>
                <div>{produto.nome}</div>
                <div>{`${produto.preco} €`}</div>
                <div>
                  <div style={{ display: "flex" }}>
                    <input
                      type="number"
                      min="1"
                      max={produto.quantidade}
                      onChange={e => {
                        const quantidade = parseInt(e.target.value);
                        if (quantidade > produto.quantidade) {
                          setNotification(`Quantidade de stoque insuficiente (${produto.quantidade} disponíveis)`);
                        } else {
                          handleAddToCart(produto, quantidade);
                        }
                      }}
                      style={{ width: "50px", marginRight: "10px" }}
                    />
                    <button onClick={() => handleAddToCart(produto, 1)}>Adicionar ao carrinho</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
