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
    preco: 1,
    nif: 1,
    morada: 'IPCA Barber Shop',
    estado: 'carrinho'
  });

  useEffect(() => {
    getProdutos();
  }, []);

 
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    sortProdutos(event.target.value);
  };

  const onSubmit = (ev, produtoId) => {
    ev.preventDefault();
    const updatedProdutoEscolhido = {
      ...produtoEscolhido,
      idProduto: parseInt(produtoId),
      idCliente: parseInt(localStorage.getItem('userId')),
      preco: produtos.find(produto => produto.id === produtoId).preco
    };
  
    //Buscamos os dados da tabela carrinhos
    axiosClient
      .get('/carrinhos')
      .then(({ data }) => {
        const carrinhos = data.data;
  
        //Verifica se o idProduto e idCliente ja existe em alguma row
        const existingRow = carrinhos.find(
          (row) =>
            row.idProduto === updatedProdutoEscolhido.idProduto &&
            row.idCliente === updatedProdutoEscolhido.idCliente &&
            row.estado === 'carrinho'
        );
  
  
        // Vai à tabela produtos e verifica os produtos com o mesmo id que idProdutos (idProdutos é um campo na tabela carrinhos com os ids dos produtos que o cliente adicionou ao carrinho)
        axiosClient
          .get(`/produtos/${updatedProdutoEscolhido.idProduto}`)
          .then(({ data }) => {
            const produto = data.data;
  
            if (existingRow) {
              // Se o produto ja existir na tabela então a quantidade é aumentada
              const updatedRow = {
                ...existingRow,
                quantidadePedida: existingRow.quantidadePedida + 1,
                preco: existingRow.preco + updatedProdutoEscolhido.preco
              };
            
              // Verifica se a quantidade pedida passa os valores de stock
              if (updatedRow.quantidadePedida > produto.quantidade) {
                setErrors({
                  quantidadePedida:
                    'A quantidade pedida excede a quantidade disponível.',
                });
                setNotification('Quantidade limitada ao stock.');
              } else {
                axiosClient
                  .put(`/carrinhos/${existingRow.id}`, updatedRow)
                  .then(() => {
                    setNotification('Quantidade atualizada com sucesso');
                  })
                  .catch((err) => {
                    const response = err.response;
                    if (response && response.status === 422) {
                      setErrors(response.data.errors);
                    }
                  });
              }
            } else {
              // Se este produto ainda não existir na tabela, adiciona uma nova row
              axiosClient
                .post('/carrinhos', updatedProdutoEscolhido)
                .then(() => {
                  setNotification('Produto adicionado ao carrinho com sucesso');
                })
                .catch((err) => {
                  const response = err.response;
                  if (response && response.status === 422) {
                    setErrors(response.data.errors);
                  }
                });
            }
          })
          .catch((err) => {
            const response = err.response;
            if (response && response.status === 404) {
              // Erro caso o produto nao seja encontrado
              setErrors({ produto: 'Produto não encontrado.' });
            }
          });
      })
      .catch(() => {
        setLoading(false);
      });
  };
  

  //busca informação sobre os produtos e as imagens respetivas
  const getProdutos = (filtro = 'Todos') => {
    setLoading(true);
    let url = '/produtos';
    if (filtro !== 'Todos') {
      url += `?tipo=${filtro}`;
    }
    axiosClient
      .get(url)
      .then(({ data }) => {
        const ProdutosList = data.data.map(produto => ({
          ...produto,
          imgUrl: 'src/img/' + produto.nome + '.png'
        }));
        setLoading(false);
        setProdutos(ProdutosList);
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
    const term = event.target.value;
    setSearchTerm(term);
  };
  
  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.tipo.toLowerCase().includes(searchTerm.toLowerCase())
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
      <img className='img-produtos' src={produto.imgUrl} alt={produto.nome} style={{paddingTop:'5px', paddingBottom:'5px'}}/>
      <div>{produto.descricao}</div>
      <div>{`${produto.preco} €`}</div>
      

      
      <div style={{ fontSize:"17px" }}>Quantidade em stock: {produto.quantidade}</div>
      <div style={{ display: "flex", alignItems: "center" }}>
      {produto.quantidade === 0 ? (
  <button style={{ width: 200, height: 50, backgroundColor: "#b72424", cursor: "not-allowed", color: "white"  }} className="btn-login" disabled>
    Fora de stock
  </button>
) : (
  <button style={{ width: 200, height: 50 }} className="btn-login" onClick={(event) => onSubmit(event, produto.id)} >
    Adicionar ao carrinho
  </button>
)}
      </div>
    </div>
  </form>
))}
      </div>
    </div>
  );
}
