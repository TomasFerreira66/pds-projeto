import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    getUsers();
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    getUsers(event.target.value);
  }

  const onDeleteClick = user => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getUsers(filter)
      })
  }

  const getUsers = (filter = 'Todos') => {
    setLoading(true)
    let url = '/users';
    if (filter !== 'Todos') {
      url += `?tipo=${filter}`;
    }
    axiosClient.get(url)
      .then(({ data }) => {
        setLoading(false)
        setUsers(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Utilizadores</h1>
        <div>
          <Link className="btn-add" to="/users/new">Adicionar Barbeiro</Link>
          <select value={filter} onChange={handleFilterChange}>
            <option value="Todos">Todos</option>
            <option value="Barbeiro">Barbeiro</option>
            <option value="admin">Admin</option>
            <option value="Cliente">Cliente</option>
          </select>
        </div>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>           
            <th>Criado a</th>
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
            {users.filter(user => filter === 'Todos' || user.tipo === filter).map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td>{user.tipo}</td>               
                <td>{user.created_at}</td>
                <td>
                  <Link to={`/users/${user.id}`} className="btn-add">Editar</Link>
                  <button onClick={() => onDeleteClick(user)} className="btn-delete">Apagar</button>
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

