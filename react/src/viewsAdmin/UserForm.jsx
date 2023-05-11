import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function UserForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    tipo: 'Barbeiro',
    especialidade: '',
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filtro, setFiltro] = useState("Todos") // novo estado para armazenar o tipo de filtro selecionado
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/users/${id}`)
        .then(({data}) => {
          setLoading(false)
          setUser(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user)
        .then(() => {
          setNotification('Utilizador editado com sucesso')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/users', user)
        .then(() => {
          setNotification('Utilizador criado com sucesso')
          navigate('/users')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {user.id && <h1>Editar utilizador: {user.name}</h1>}
      {!user.id && <h1>Adicionar barbeiro</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
          <input value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} placeholder="Nome"/>
          <input value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email"/>
          <input type="password" onChange={ev => setUser({...user, password: ev.target.value})} placeholder="Palavra-passe"/>
          <input type="password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})} placeholder="Confirmar palavra-passe"/>
          <select className="dropdown-menu" name="especialidade" value={user.especialidade} onChange={ev => setUser({...user, especialidade: ev.target.value})}>
            <option>Especialidade</option>
            <option value="Corte">Corte</option>
            <option value="Barba">Barba</option>
            <option value="Corte + Barba">Corte + Barba</option>
          </select>
          <br></br><br></br>
          <button className="btn">Adicionar barbeiro</button>
        </form>
        
        )}
      </div>
    </>
  )
}