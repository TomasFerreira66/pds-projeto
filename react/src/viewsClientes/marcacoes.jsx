import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useState } from "react";

export default function marcacoes() {

  const [marcacoes, setMarcacoes] = useState([]);

  useEffect(() => {
    getMarcacoes();
  }, []);
  
  const getMarcacoes = () => {
    axiosClient.get('/marcacoes')
      .then(({ data }) => {
        setMarcacoes(data.data);
      })
      .catch(() => {
      });
  }
  
  
  return (
    <div className='card animated fadeInDown' style={{ marginLeft: '100px' , marginRight: '100px'}}>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h2>Marcações</h2>
      </div>
      {marcacoes.map((marcacao) => (
        <div key={marcacao.id}>
          <p>Serviço: {marcacao.servico}</p>
          <p>Data: {marcacao.data}</p>
          <p>Horário: {marcacao.horario}</p>
        </div>
      ))}
    </div>
  );
  
}