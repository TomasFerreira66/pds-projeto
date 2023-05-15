import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();
  const [filter, setFilter] = useState('Todos');
  

  useEffect(() => {
    getProdutos();
  }, [])
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    getProdutos(event.target.value);
  }
   
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    sortProdutos(event.target.value);
  };
 

  const onDeleteClick = produto => {
    if (!window.confirm("De certeza que queres eliminar este produto?")) {
      return
    }
    axiosClient.delete(`/produtos/${produto.id}`)
      .then(() => {
        setNotification('Produto eliminado com sucesso')
        getProdutos(filter)
      })
  }

  const getProdutos = (filter = 'Todos') => {
    setLoading(true)
    let url = '/produtos';
    if (filter !== 'Todos') {
      url += `?tipo=${filter}`;
    }
    axiosClient.get(url)
      .then(({ data }) => {
        setLoading(false)
        setProdutos(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }
  


  return (
    <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h2>Produtos</h2>
        <div>
          <Link className="btn-add" to="/AdicionarProduto">Adicionar produto</Link>
          <select name="filtro" value={filter} onChange={handleFilterChange}>
            <option value="Todos">Todos</option>
            <option value="Cabelo">Cabelo</option>
            <option value="Barba">Barba</option>
          </select>
        </div>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Tipo</th> 
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
            {produtos.filter(produtos => filter === 'Todos' || produtos.tipo === filter).map(produto => (
              <tr key={produto.id}>
                <td>{produto.id}</td>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>{`${produto.preco} €`}</td>
                <td>{produto.quantidade}</td>  
                <td>{produto.tipo}</td>        
                <td>
                  <button onClick={() => onDeleteClick(produto)} className="btn-delete">Apagar</button>
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
