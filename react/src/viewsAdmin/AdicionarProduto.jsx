import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import Axios from "axios";
export default function AdicionarProduto() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [produto, setProduto] = useState({
    id: null,
    nome: '',
    descricao: '',
    preco: '',
    quantidade: '',
    tipo: '',

  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()
  const [imageData, setImagedata] = useState('')

  const handleChange = file => {

    setImagedata(file[0]);
    
      }

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/produtos/${id}`)
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
    
      axiosClient.post('/produtos', produto)
        .then(() => {
          setNotification('Produto adicionado com sucesso')
          navigate('/listaProdutos')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })

        const fData = new FormData();
  fData.append('name', produto.nome);
  fData.append('image', imageData);

  Axios.post('http://127.0.0.1:8000/api/upload-image', fData)
    .then(res => {
      console.log('response', res);
    })
    .catch(e => {
      console.error('Failure', ev);
    });
};

  

  return (
    <>
    <div className="card animated fadeInDown" style={{ marginLeft: '100px', marginRight: '100px' }}>
      {produto.id && <h2>Editar produto:</h2>}
      {!produto.id && <h2>Adicionar produto</h2>}
      <br /><br />
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
          <input value={produto.descricao} onChange={ev => setProduto({...produto, descricao: ev.target.value})} placeholder="Descrição"/>
          <input value={produto.preco} onChange={ev => setProduto({...produto, preco: ev.target.value})} placeholder="Preço"/>
          <input value={produto.quantidade} onChange={ev => setProduto({...produto, quantidade: ev.target.value})} placeholder="Quantidade"/>
          <select className="dropdown-menu" name="tipo" value={produto.tipo} onChange={ev => setProduto({...produto, tipo: ev.target.value})}>
            <option>Tipo</option>
            <option value="Cabelo">Cabelo</option>
            <option value="Barba">Barba</option>
          </select>
          <input name="image" id="image" type="file" onChange={e => handleChange(e.target.files)} required />
          <br></br><br></br>
          <button className="btn">Adicionar produto</button>
        </form>
        
        )}
      </div>
    </>
  )
}