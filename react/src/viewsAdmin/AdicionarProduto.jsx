import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function adicionarProduto() {
  const navigate = useNavigate();
  const [produto, setProduto] = useState({
    id: null,
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '0',
    tipo: '',

  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
    const {setNotification} = useStateContext()


  const onSubmit = ev => {
    ev.preventDefault()
    
      axiosClient.post('/produtos', produto)
        .then(() => {
          setNotification('Utilizador criado com sucesso')
          navigate('/listaProdutos')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  

  return (
    <>
      {produto.id && <h1>Editar utilizador:</h1>}
      {!produto.id && <h1>Adicionar barbeiro</h1>}
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
          <input value={produto.nome} onChange={ev => setProduto({...produto, nome: ev.target.value})} placeholder="Nome"/>
          <input value={produto.descricao} onChange={ev => setProduto({...produto, descricao: ev.target.value})} placeholder="Descricao"/>
          <input value={produto.preco} onChange={ev => setProduto({...produto, preco: ev.target.value})} placeholder="Preco"/>
         
          <select className="dropdown-menu" name="tipo" value={produto.tipo} onChange={ev => setProduto({...produto, tipo: ev.target.value})}>
            <option>Tipo</option>
            <option value="Cabelo">Cabelo</option>
            <option value="Barba">Barba</option>

          </select>
          <br></br><br></br>
          <button className="btn">Adicionar produto</button>
        </form>
        
        )}
      </div>
    </>
  )
}