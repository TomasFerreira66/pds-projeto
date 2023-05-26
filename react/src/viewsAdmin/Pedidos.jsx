import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [users, setUsers] = useState({});
  const [produtos, setProdutos] = useState({});
  const { id } = useParams();
  const { user } = useStateContext();

  const getUsers = (pedidos) => {
    const userIds = [...new Set(pedidos.map((carrinho) => carrinho.idCliente))];
    const promises = userIds.map((id) => axiosClient.get(`/users/${id}`));
    
    Promise.all(promises)
      .then((responses) => {
        const newUsers = {};
        responses.forEach((response) => {
          newUsers[response.data.id] = response.data.name;
        });
        setUsers(newUsers);
      })
      .catch(() => {
        setUsers({});
      });
  };

  const getProdutos = (pedidos) => {
    const produtoIds = [...new Set(pedidos.map((carrinho) => carrinho.idProduto))];
    const promises = produtoIds.map((id) => axiosClient.get(`/produtos/${id}`));
    
    Promise.all(promises)
      .then((responses) => {
        const newProdutos = {};
        responses.forEach((response) => {
          newProdutos[response.data.data.id] = response.data.data.nome;
        });
        setProdutos(newProdutos);
      })
      .catch(() => {
        setProdutos({});
      });
  };

  const getPedidos = () => {
    setLoading(true);
    axiosClient
      .get("/carrinhos")
      .then(({ data }) => {
        setLoading(false);
        setPedidos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getPedidos();
  }, []);

  useEffect(() => {
    if (pedidos.length > 0) {
      getUsers(pedidos);
      getProdutos(pedidos);
    }
  }, [pedidos]);

  const distribuirPedidos = () => {
    setLoading(true);

    // Get the IDs of the selected carrinhos
    const selectedCarrinhosIds = pedidos
      .filter((carrinho) => carrinho.estado === "Pago" && carrinho.selected)
      .map((carrinho) => carrinho.id);

    // Simulação de uma chamada assíncrona para atualizar o estado dos carrinhos
    setTimeout(() => {
      const pedidosAtualizados = pedidos.map((carrinho) => {
        if (selectedCarrinhosIds.includes(carrinho.id)) {
          // Update the estado directly in the current table
          axiosClient
            .patch(`/carrinhos/${carrinho.id}`, { estado: "Concluído" })
            .catch(() => {
              // Handle error if the update fails
              setNotification("Failed to update estado.");
            });

          return { ...carrinho, estado: "Concluído" };
        }
        return carrinho;
      });

      setPedidos(pedidosAtualizados);
      setLoading(false);
    }, 2000); // Tempo de espera simulado para demonstração

    // Lógica adicional para distribuir os pedidos
  };

  const togglePedidoSelecionado = (id) => {
    setPedidos((prevPedidos) =>
      prevPedidos.map((pedido) => {
        if (pedido.id === id) {
          return {
            ...pedido,
            selected: !pedido.selected,
          };
        }
        return pedido;
      })
    );
  };

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Lista de pedidos</h2>
      </div>
      &nbsp;
      {pedidos.filter((carrinho) => carrinho.estado === "Pago").length > 0 ? (
        <div
          className="card-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "10px",
          }}
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            pedidos
              .filter((carrinho) => carrinho.estado === "Pago")
              .map((carrinho) => (
                <div
                  key={carrinho.id}
                  className="card animated fadeInDown"
                  style={{
                    padding: "10px",
                    borderRadius: "10px",
                    position: "relative",
                    height: "150px",
                  }}
                >
                  <div style={{ marginBottom: "10px" }}>
                    {`${users[carrinho.idCliente] || "-"}`}
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    {`${carrinho.quantidadePedida} unidades - ${
                      produtos[carrinho.idProduto] || "-"
                    }`}
                  </div>
                  <div style={{ fontSize: "18px", marginTop: "10px" }}>
                    {carrinho.morada}
                  </div>
                  <div
                    style={{ position: "absolute", bottom: "10px", right: "10px" }}
                  >
                    <input
                      type="checkbox"
                      checked={carrinho.selected}
                      onChange={() => togglePedidoSelecionado(carrinho.id)}
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      ) : (
        <div
          className="card animated fadeInDown"
          style={{
            padding: "10px",
            borderRadius: "10px",
            textAlign: "left",
          }}
        >
          Neste momento não existem pedidos pendentes.
        </div>
      )}
      {pedidos.filter((carrinho) => carrinho.estado === "Pago").length > 0 && (
        <button onClick={distribuirPedidos} className="btn-login">
          Concluir
        </button>
      )}
    </div>
  );
}
