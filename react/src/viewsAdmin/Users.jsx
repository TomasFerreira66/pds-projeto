import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [filter, setFilter] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("desc");
  const [specialtyFilter, setSpecialtyFilter] = useState("Todos"); // Novo estado para o filtro de especialidade

  useEffect(() => {
    getUsers();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    getUsers(event.target.value, specialtyFilter);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    sortUsers(event.target.value);
  };

  const handleSpecialtyFilterChange = (event) => {
    setSpecialtyFilter(event.target.value);
    getUsers(filter, event.target.value);
  };

  const onDeleteClick = (user) => {
    if (!window.confirm("De certeza que queres eliminar este utilizador?")) {
      return;
    }

    axiosClient
      .delete(`/users/${user.id}`)
      .then(() => {
        if (user.type === "Barbeiro") {
          // Delete associated records in `/marcacaos` table
          axiosClient
            .delete(`/marcacaos?idBarbeiro=${user.id}`)
            .then(() => {
              setNotification("Utilizador e registos associados eliminados com sucesso");
              getUsers(filter, specialtyFilter);
            })
            .catch((error) => {
              console.error("Error deleting associated records:", error);
              setNotification("Erro ao eliminar os registos associados");
            });
        } else {
          setNotification("Utilizador eliminado com sucesso");
          getUsers(filter, specialtyFilter);
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        setNotification("Erro ao eliminar o utilizador");
      });
  };

  const getUsers = (filter = "Todos", specialtyFilter = "Todos") => {
    setLoading(true);
    let url = "/users";
    axiosClient
      .get(url)
      .then(({ data }) => {
        setLoading(false);
        let filteredUsers = data.data;
        if (filter !== "Todos") {
          filteredUsers = filteredUsers.filter((user) => user.tipo === filter);
        }
        if (specialtyFilter !== "Todos") {
          filteredUsers = filteredUsers.filter((user) => user.especialidade === specialtyFilter);
        }
        // Ordenar os usuários por tipo
        filteredUsers.sort((a, b) => (a.tipo > b.tipo) ? 1 : -1);
        setUsers(filteredUsers);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  
  const sortUsers = (order) => {
    let sortedUsers = [...users];
    sortedUsers.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      if (order === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
    setUsers(sortedUsers);
  };

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Utilizadores</h2>
        <div>
          <Link className="btn-add" to="/users/new">
            Adicionar barbeiro
          </Link>
          <select name="filtro" value={filter} onChange={handleFilterChange}>
            <option value="Todos">Tipo</option>
            <option value="Barbeiro">Barbeiro</option>
            <option value="admin">Admin</option>
            <option value="Cliente">Cliente</option>
          </select>
          <select name="filtro1" value={specialtyFilter} onChange={handleSpecialtyFilterChange}>
            <option value="Todos">Especialidade</option>
            <option value="Corte">Corte</option>
            <option value="Barba">Barba</option>
            <option value="Corte + Barba">Corte + Barba</option>
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
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Especialidade</th>
              <th>Criado a</th>
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
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.tipo}</td>
                  <td>{user.especialidade}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/users/${user.id}`} className="btn-edit">
                      Editar
                    </Link>
                    <button onClick={() => onDeleteClick(user)} className="btn-delete">
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
