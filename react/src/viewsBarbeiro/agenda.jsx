import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Agenda() {
  const [marcacaos, setMarcacao] = useState([]);
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
    axiosClient.get('/marcacaos')
      .then(({ data }) => {
        setLoading(false);
        setMarcacao(data.data);
        getCliente(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getMarcacoes();
  }, []);

  const concluirMarcacao = (marcacao) => {
    axiosClient.put(`/marcacaos/${marcacao.id}`, { estado: 'Concluído' })
      .then(() => {
        setNotification('Marcação concluída com sucesso');
        getMarcacoes();
      })
      .catch(() => {
        setNotification('Ocorreu um erro ao concluir a marcação');
      });
  };
  
  const onDeleteClick = marcacao => {
    console.log(marcacao);
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/marcacaos/${marcacao.id}`)
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
              <th>Estado</th>
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
              {marcacaos
             .filter(marcacao => marcacao.idBarbeiro === Number(id) && marcacao.estado === "Ativo")

                .map(marcacao => (
                  <tr key={marcacao.id}>
                    <td>{marcacao.id}</td>
                    <td>{marcacao.servico}</td>
                    <td>{clientes[marcacao.idCliente] || "-"}</td>
                    <td>
                      {new Date(marcacao.data).toLocaleString("pt-PT", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                      })}
                    </td>
                    <td>{marcacao.estado}</td>
                    <td>
                      <button onClick={() => concluirMarcacao(marcacao)} className="btn-add">Concluir</button>
                      &nbsp;
                      <button onClick={() => onDeleteClick(marcacao)} className="btn-delete">Cancelar</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  );
        }  