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
          <div className='card animated fadeInDown ' style={{ marginLeft: '100px', marginRight: '100px' }}>
            <h2>Conta</h2>
          </div>
          <div>
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
                     
                     <ul className="menu">
                  <li>
                    <Link className="btn btn-lg btn-primary me-3" to={'/Perfil/' + u.id}>Editar</Link>
                  </li>
                  <li>
                    <Link className="btn btn-lg btn-primary" to={'/Historico/' + u.id}>Histórico</Link>
                  </li>
                </ul>
                

                    </tr>
                  ))}
                </tbody>
              }
            </table>
          </div>
    </div>
  )
}
