import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState({});
  const { setNotification } = useStateContext();
  const { id } = useParams();

  const getCliente = (marcacoes) => {
    const clienteIds = [...new Set(marcacoes.map((marcacao) => marcacao.idCliente))];
    const promises = clienteIds.map((id) => axiosClient.get(`/users/${id}`));
    Promise.all(promises)
    .then((responses) => {
      const newClientes = {};
      responses.forEach((response) => {
        newClientes[response.data.id] = response.data.name;
      });
      setClientes(newClientes);
    })
    .catch(() => {
      setClientes({});
    });
  };

  const getMarcacoes = () => {
    setLoading(true);
    axiosClient.get('/marcacoes')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        getCliente(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getMarcacoes();
  }, []);


  //esta merda nao ta a dar
  const onDeleteClick = marcacao => {
    console.log(marcacao); // add this line to check the `marcacao` object
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/marcacoes/${marcacao.id}`)
      .then(() => {
        setNotification('Marcação was successfully canceled')
        getMarcacoes()
      })
      .catch(() => {
        setNotification('There was an error while canceling the marcação')
      });
  }
  

  return (
    <div style={{ marginLeft: '100px', marginRight: '100px' }}>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h2>As suas marcações</h2>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>Nº</th>
              <th>Serviço</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          {loading &&
            <tbody>
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
              </td>
              </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
              {users
                .filter(marcacao => marcacao.idBarbeiro === Number(id))
                .map(marcacao => (
                  <tr key={marcacao.id}>
                    <td>{marcacao.id}</td>
                    <td>{marcacao.servico}</td>
                    <td>{clientes[marcacao.idCliente] || "-"}</td>
                    <td>
                        {new Date (marcacao.data).toLocaleString("pt-PT", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric"
                        })}
                      </td>
                    <td>
                    <button onClick={() => onDeleteClick(marcacao)} className="btn-delete">Cancelar</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          }
        </table>

      </div>
    </div>
  )
}
