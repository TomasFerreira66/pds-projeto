import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const AddProductForm = ({ onAdd }) => {

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [tipo, setTipo] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/produtos', {
        nome,
        descricao,
        preco,
        quantidade,
        tipo,
      });
      onAdd(response.data); 
      setNome('');
      setDescricao('');
      setPreco(0);
      setQuantidade(0);
      setTipo('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='card animated fadeInDown' style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}/>
      <h2>Adicionar produto</h2>
      <div>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}></textarea>
      </div>
      <div>
        <label>Preço:</label>
        <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
      </div>
      <div>
        <label>Quantidade:</label>
        <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
      </div>
      <div>
        <label>Tipo:</label>
        <input type="text" value={tipo} onChange={(e) => setTipo(e.target.value)} />
      </div>
      <button type="submit">Adicionar</button>
      </div>
    </form>
  );
};

export default AddProductForm;
