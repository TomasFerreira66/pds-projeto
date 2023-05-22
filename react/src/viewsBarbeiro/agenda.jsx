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
    axiosClient
      .get("/marcacaos")
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
    axiosClient
      .put(`/marcacaos/${marcacao.id}`, { estado: "Concluído" })
      .then(() => {
        setNotification("Marcação concluída com sucesso");
        getMarcacoes();
      })
      .catch(() => {
        setNotification("Ocorreu um erro ao concluir a marcação");
      });
  };

  const onDeleteClick = (marcacao) => {
    console.log(marcacao);
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient
      .delete(`/marcacaos/${marcacao.id}`)
      .then(() => {
        setNotification("Marcação was successfully canceled");
        getMarcacoes();
      })
      .catch(() => {
        setNotification("There was an error while canceling the marcação");
      });
  };

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>As suas marcações</h2>
      </div>
      <div className="card-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
        {marcacaos
          .filter((marcacao) => marcacao.idBarbeiro === Number(id) && marcacao.estado === "Ativo")
          .map((marcacao) => (
            <div key={marcacao.id} className="card animated fadeInDown" style={{ padding: "10px", borderRadius: "10px", position: "relative" }}>
              <div>{`${marcacao.id} - ${clientes[marcacao.idCliente] || "-"}`}</div>
              <div style={{ fontSize: "18px" }}>{marcacao.servico}</div>
              <div style={{ fontSize: "18px" }}>{new Date(marcacao.data).toLocaleString("pt-PT", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}</div>
              <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
                <button onClick={() => concluirMarcacao(marcacao)} className="btn-add" style={{ marginRight: "10px" }}>
                  Concluir
                </button>
                <button onClick={() => onDeleteClick(marcacao)} className="btn-delete">
                  Cancelar
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
