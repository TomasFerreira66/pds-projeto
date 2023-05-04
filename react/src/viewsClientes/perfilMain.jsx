import {useEffect, useState, useContext} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const {user, setNotification} = useStateContext()

  useEffect(() => {
    getUsers();
  }, [])

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users')
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
        <h1>Conta</h1>
      </div>
      <div className="card animated fadeInDown">
        <table>
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
              {users.filter(u => u.id === user.id).map(u => (
                <tr key={u.id}>
                  <td style={{textAlign: "center"}}>
                    <Link className="btn-edit" to={'/Perfil/' + u.id}>Editar</Link>
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
