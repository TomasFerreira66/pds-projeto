import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Historico() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [barbeiros, setBarbeiros] = useState({});
  const { id } = useParams();
  const { user } = useStateContext();

  const getBarbeiro = (marcacoes) => {
    const barbeiroIds = [...new Set(marcacoes.map((marcacao) => marcacao.idBarbeiro))];
    const promises = barbeiroIds.map((id) => axiosClient.get(`/users/${id}`));
    Promise.all(promises)
      .then((responses) => {
        const newBarbeiros = {};
        responses.forEach((response) => {
          newBarbeiros[response.data.id] = response.data.name;
        });
        setBarbeiros(newBarbeiros);
      })
      .catch(() => {
        setBarbeiros({});
      });
  };

  const getMarcacoes = () => {
    setLoading(true);
    axiosClient
      .get("/marcacaos")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        getBarbeiro(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getMarcacoes();
  }, []);

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Histórico de marcações</h2>
      </div>
      {loading && (
        <div className="card animated fadeInDown">
          Loading...
        </div>
      )}
      {!loading && users.filter(marcacao => marcacao.idCliente === Number(id) && marcacao.estado === "Concluído").length === 0 && (
        <div className="card animated fadeInDown">
          Neste momento não existem marcações concluídas.
        </div>
      )}
      {!loading && users.filter(marcacao => marcacao.idCliente === Number(id) && marcacao.estado === "Concluído").length > 0 && (
        <div className="card animated fadeInDown">
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Serviço</th>
                <th>Custo</th>
                <th>Barbeiro</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(marcacao => marcacao.idCliente === Number(id) && marcacao.estado === "Concluído")
                .map(marcacao => {
                  return (
                    <tr key={marcacao.id}>
                      <td>{marcacao.id}</td>
                      <td>{marcacao.servico}</td>
                      <td>{marcacao.custo} €</td>
                      <td>{barbeiros[marcacao.idBarbeiro] || "-"}</td>
                      <td>
                        {new Date(marcacao.data).toLocaleString("pt-PT", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric"
                        })}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
