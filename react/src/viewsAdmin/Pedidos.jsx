import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [users, setUsers] = useState({}); 
  const { id } = useParams();
  const { user } = useStateContext();

  const getUsers = (pedidos) => { 
    const userIds = [...new Set(pedidos.map((carrinhos) => carrinhos.idCliente))]; 
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
  
  const getPedidos = () => {
    setLoading(true);
    axiosClient.get('/carrinhos')
      .then(({ data }) => {
        setLoading(false);
        setPedidos(data.data);
        getUsers(data.data); 
      })
      .catch(() => {
        setLoading(false);
      });
  };
  
  useEffect(() => {
    getPedidos();
  }, []);


  const distribuirPedidos = () => {
    setLoading(true);

    // Simulação de uma chamada assíncrona para atualizar o estado dos carrinhos
    setTimeout(() => {
      const pedidosAtualizados = pedidos.map((carrinho) => {
        if (carrinho.estado === 'Pago' && carrinho.selected) {
          return { ...carrinho, estado: 'Enviado' };
        }
        return carrinho;
      });

      setPedidos(pedidosAtualizados);
      setLoading(false);
    }, 2000); // Tempo de espera simulado para demonstração

    // Lógica adicional para distribuir os pedidos
  };

  const togglePedidoSelecionado = (id) => {
  setPedidos(prevPedidos => prevPedidos.map(pedido => {
    if (pedido.id === id) {
      return {
        ...pedido,
        selected: !pedido.selected
      };
    }
    return pedido;
  }));
};

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h2>Lista de Pedidos</h2>
      </div>
      &nbsp;
      <div className="card-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          pedidos
            .filter((carrinhos) => carrinhos.estado === "Pago")
            .map((carrinhos) => (
              <div key={carrinhos.id} className="card animated fadeInDown" style={{ padding: "10px", borderRadius: "10px", position: "relative", height:'150px' }}>
                <div style={{ marginBottom: "10px" }}>{`${carrinhos.id} - ${users[carrinhos.idCliente] || "-"}`}</div> 
                <div style={{ fontSize: "18px", marginTop: "10px" }}>{carrinhos.morada}</div>
                <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
        <input
          type="checkbox"
          checked={carrinhos.selected}
          onChange={() => togglePedidoSelecionado(carrinhos.id)}
        />
      </div>
              </div>
            ))
        )}
      </div>
      <button onClick={distribuirPedidos}>Distribuir</button>
    </div>
  );
}