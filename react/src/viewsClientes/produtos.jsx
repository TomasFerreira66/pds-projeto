import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import "react-datepicker/dist/react-datepicker.css";

export default function Produtos() {
  const { user, setNotification, setAlert } = useStateContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState("desc");
  const [errors, setErrors] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [produtoEscolhido, setProdutoEscolhido] = useState({
    id: null,
    idProduto: '',
    idCliente: localStorage.getItem('userId'),
    quantidadePedida: 1,
  });

  useEffect(() => {
    getProdutos();
  }, []);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setLoading(true);
    setFilter(newFilter);
    getProdutos(newFilter);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    sortProdutos(event.target.value);
  };

  const onSubmit = (ev, produtoId) => {
    ev.preventDefault();
    const updatedProdutoEscolhido = {
      ...produtoEscolhido,
      idProduto: produtoId.toString(),
    };

    if (parseInt(updatedProdutoEscolhido.quantidadePedida) > produtoEscolhido.quantidade) {
      const quantidadeDisponivel = produtoEscolhido.quantidade;
      setNotification(`Quantidade indisponível, quantidade em stock: ${quantidadeDisponivel}`);
      return;
    }

    axiosClient
      .post('/carrinhos', updatedProdutoEscolhido)
      .then(() => {
        setNotification('Produto adicionado ao carrinho com sucesso');
        navigate(`/carrinho/${user.id}`);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const getProdutos = (filtro = 'Todos') => {
    setLoading(true);
    let url = '/produtos';
    if (filtro !== 'Todos') {
      url += `?tipo=${filtro}`;
    }
    axiosClient
      .get(url)
      .then(({ data }) => {
        setLoading(false);
        setProdutos(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const sortProdutos = (order) => {
    let sortedProdutos = [...produtos];
    sortedProdutos.sort((a, b) => {
      if (order === "asc") {
        return a.preco - b.preco;
      } else {
        return b.preco - a.preco;
      }
    });
    setProdutos(sortedProdutos);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm) ||
      produto.descricao.toLowerCase().includes(searchTerm) ||
      produto.tipo.toLowerCase().includes(searchTerm)
  );

  return (
    <div style={{ marginLeft: "100px", marginRight: "100px" }}>
      <h2>Produtos</h2>
      <br />
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={handleSearch}
            style={{ marginRight: '10px', marginBottom: '-15px' }}
          />
          <select name="ordenar2" value={sortOrder} onChange={handleSortChange}>
            <option value="asc">Preço: Mais baixo para mais alto</option>
            <option value="desc">Preço: Mais alto para mais baixo</option>
          </select>
        </div>
      </div>
      <br />
      <div className="card-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {filteredProdutos.map((produto) => (
          <form key={produto.id} onSubmit={(event) => onSubmit(event, produto.id)}>
            <div id={produto.id} className="card animated fadeInDown key" style={{ display: "grid", gridTemplateRows: "1fr auto auto", padding: "10px", borderRadius: "10px" }}>
              <div>{produto.nome}</div>
              <div>{produto.descricao}</div>
              <div>{`${produto.preco} €`}</div>
              <div>Quantidade em stock: {produto.quantidade}</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  style={{ width: 200, height: 50 }}
                  className="btn-login"
                  onClick={(event) => onSubmit(event, produto.id)}
                >
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
