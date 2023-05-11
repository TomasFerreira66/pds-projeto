import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function ListaProdutos() {
    const [loading, setLoading] = useState(false);
  
  return (
    <div style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h2>Produtos</h2>
        <div>
          <Link className="btn-add" to="/adicionarProduto">Adicionar produto</Link>
        </div>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
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
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
