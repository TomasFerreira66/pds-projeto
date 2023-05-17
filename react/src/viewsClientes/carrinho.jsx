import { useEffect, useState } from "react";
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

  const getCarrinho = () => {
    setLoading(true);
    axiosClient.get('/carrinhos')
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
    axiosClient.get(`/produtos/${idProduto}`)
      .then((response) => {
        const { data } = response;
        const nestedData = data.data; 
        if (nestedData && nestedData.nome) {
          setProdutos(prevState => ({
            ...prevState,
            [idProduto]: nestedData.nome
          }));
        } else {
          console.log(`Product nome not found for idProduto ${idProduto}`);
        }
      })
      .catch(error => {
        console.log(`Error fetching product data for idProduto ${idProduto}:`, error);
      });
  };
  

  const getNomeProdutos = (carrinhos) => {
    carrinhos.forEach(carrinho => {
      const idProduto = carrinho.idProduto;
      if (!produtos[idProduto]) {
        getProduto(idProduto);
      }
    });
  };

  useEffect(() => {
    getCarrinho();
  }, []);

  const onDeleteClick = carrinho => {
    if (!window.confirm("De certeza que queres cancelar a tua marcação?")) {
      return;
    }
    axiosClient.delete(`/carrinhos/${carrinho.id}`)
      .then(() => {
        setNotification('Marcação cancelada com sucesso');
      });
      getCarrinho();
  };

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
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
              .filter(carrinho => carrinho.idCliente === Number(id))
              .map(carrinho => {
                const produtoNome = produtos[carrinho.idProduto] || "";
                console.log("produtoNome:", produtoNome); // Add this console log
                return (
                  <tr key={carrinho.id}>
                    <td>{produtoNome}</td>
                    <td>x{carrinho.quantidadePedida}</td>  
                    <td>
                      <button onClick={() => onDeleteClick(carrinho)} className="btn-delete">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
          )}
        </table>
      </div>
    </div>
  );
}