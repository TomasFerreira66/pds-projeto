import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";

export default function marcacoes() {
  const [marcacoes, setMarcacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMarcacoes();
  }, [])

  const onDeleteClick = marcacoes => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/marcacoes/${marcacoes.id}`)
      .then(() => {
        getMarcacoes()
      })
  }

  const getMarcacoes = () => {
    setLoading(true)
    axiosClient.get('/marcacoes')
      .then(({ data }) => {
        setLoading(false)
        setMarcacoes(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Marcações</h1>
        <Link className="btn-add" to="/novaMarcacao">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>Serviço</th>
            <th>Barbeiro</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {marcacoes.map(m => (
              <tr key={m.id}>
                <td>{m.servico}</td>
                <td>{m.idBarbeiro}</td>
                <td>{m.data}</td>
                <td>
                  <button className="btn-delete" onClick={ev => onDeleteClick(m)}>Delete</button>
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