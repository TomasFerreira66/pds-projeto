import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Stock(){
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProdutos();
      }, [])

    const getProdutos = () => {
        setLoading(true);
        const url = '/produtos';
        
        axiosClient.get(url)
          .then(({ data }) => {
            setLoading(false);
            setProdutos(data.data);
          })
          .catch(() => {
            setLoading(false);
          });
      }
      

    return (
  <div style={{ marginLeft: '100px', marginRight: '100px' }}>
    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
      <h2>Stock</h2>
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
            {produtos.map(produto => (
              <tr key={produto.id}>
                <td>{produto.id}</td>
                <td>{produto.nome}</td>
                <td>{produto.descricao}</td>
                <td>{`${produto.preco} €`}</td>
                <td>{produto.quantidade}</td>
                <td>{produto.tipo}</td>
                <td>
                    botao para add stock
                </td>
              </tr>
            ))}
          </tbody>
        }
      </table>
    </div>
  </div>
);

}