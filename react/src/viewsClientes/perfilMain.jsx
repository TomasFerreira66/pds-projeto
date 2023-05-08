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
                                                                                                                                                                                                                          <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> <br></br>
              {!loading &&
                <tbody>
                  {users.filter(u => u.id === user.id).map(u => (
                    <tr key={u.id}>
                     
                      <td style={{textAlign: "center"}}>
                        <Link className="btn btn-lg btn-primary me-3" style={{padding: "60px", fontSize: "30px", border: "1px solid black", borderRadius: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.5)"}} to={'/Perfil/' + u.id}>Editar</Link>
                      </td>
                      <td style={{textAlign: "center"}}>
                        <Link className="btn btn-lg btn-primary" style={{padding: "60px", fontSize: "30px", border: "1px solid black", borderRadius: "10px", boxShadow: "0px 0px 5px rgba(0,0,0,0.5)"}} to={'/Historico/' + u.id}>Historico</Link>
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
