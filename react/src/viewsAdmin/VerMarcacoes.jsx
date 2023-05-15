import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Marcacaos() {
  const [marcacaos, setMarcacaos] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();
  const [filter, setFilter] = useState('Todos');
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    getMarcacaos();
  }, [])
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    getMarcacaos(event.target.value);
  }
   
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    sortMarcacaos(event.target.value);
  };
 

  const onDeleteClick = marcacao => {
    if (!window.confirm("De certeza que queres eliminar este utilizador?")) {
      return
    }
    axiosClient.delete(`/marcacaos/${marcacao.id}`)
      .then(() => {
        setNotification('Marcacao eliminada com sucesso')
        getMarcacaos(filter)
      })
  }

  const getMarcacaos = (filter = 'Todos') => {
    setLoading(true)
    let url = '/marcacaos';
    if (filter !== 'Todos') {
      url += `?servico=${filter}`;
    }
    axiosClient.get(url)
      .then(({ data }) => {
        setLoading(false)
        setMarcacaos(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  
  const sortMarcacaos = (order) => {
    let sortedMarcacaos = [...marcacaos];
    sortedMarcacaos.sort((a, b) => {
      const dateA = new Date(a.data);
      const dateB = new Date(b.data);
      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setMarcacaos(sortedMarcacaos);
  };

  return (
    <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h2>Marcaçoes</h2>
        <div>
          <select name="filtro" value={filter} onChange={handleFilterChange}>
            <option value="Todos">Todos</option>
            <option value="Corte + Barba">Corte + Barba</option>
            <option value="Barba">Barba</option>
            <option value="Corte">Corte</option>
          </select>
          <select name="ordenar" value={sortOrder} onChange={handleSortChange}>
            <option value="desc">Recente</option>
            <option value="asc">Antigo</option>
          </select>
        </div>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Serviço</th>
            <th>Data</th>
            <th>Barbeiro</th>
            <th>Cliente</th>           
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
            {marcacaos.filter(marcacao => filter === 'Todos' || marcacao.servico === filter).map(marcacao => (
              <tr key={marcacao.id}>
                <td>{marcacao.id}</td>
                <td>{marcacao.servico}</td>
                <td>{marcacao.data}</td>
                <td>{marcacao.idBarbeiro}</td>
                <td>{marcacao.idCliente}</td>               
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
