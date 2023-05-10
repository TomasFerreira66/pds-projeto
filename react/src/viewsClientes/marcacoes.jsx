import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link, useParams } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const { id } = useParams();

  const getMarcacoes = () => {
    setLoading(true);
    axiosClient.get('/marcacoes')
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
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
              <th>ID</th>
              <th>Data</th>
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
                .filter(marcacao => marcacao.idCliente === Number(id))
                .map(marcacao => (
                  <tr key={marcacao.id}>
                    <td>{marcacao.id}</td>
                    <td>{marcacao.data}</td>
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
