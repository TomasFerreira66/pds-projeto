import React, { useState, useEffect } from 'react';
import axios from 'axios';
import axiosClient from '../axios-client';

export default function Marcacoes() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState('');

  useEffect(() => {
    getBarbeiros();
    getEspecialidades();
  }, [])

  const getBarbeiros = () => {
    axiosClient.get('/users')
      .then(({ data }) => {
        const barbeirosList = data.data.filter(user => user.tipo === 'Barbeiro').map(barbeiro => ({
          ...barbeiro
        }));
        setBarbeiros(barbeirosList);
      })
      .catch(() => {
      })
  }

  const getEspecialidades = () => {
    axiosClient.get('/users')
      .then(({ data }) => {
        const especialidadesList = data.data.filter(user => ['Corte', 'Barba', 'Corte + Barba'].includes(user.especialidade))
                                            .map(user => user.especialidade)
                                            .filter((value, index, self) => self.indexOf(value) === index);
        setEspecialidades(especialidadesList);
      })
      .catch(() => {
      });
  };
  
  const handleEspecialidadeSelecionada = (event) => {
    setEspecialidadeSelecionada(event.target.value);
  }

  const getBarbeirosEspecialidade = (especialidadeSelecionada) => {
    axiosClient.get('/users')
      .then(({ data }) => {
        const barbeirosList = data.data.filter(user => user.tipo === 'Barbeiro' && user.especialidade === especialidadeSelecionada)
          .map(barbeiro => ({
            ...barbeiro
          }));
        setBarbeiros(barbeirosList);
      })
      .catch(() => {
      })
  }

  return (
    <div className='card animated fadeInDown' style={{ marginLeft: '100px', marginRight: '100px' }}>
      <h2>Marcações</h2>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <br /><br />
        <h4 style={{ marginBottom: '10px' }}>Selecionar serviço:</h4>
        <select className='dropdown-servico' style={{ marginTop: '20px' }} onChange={(event) => getBarbeirosEspecialidade(event.target.value)}>
          <option value="">Escolha uma opção</option>
          {especialidades.map((especialidade, index) => (
            <option value={especialidade} key={index}>{especialidade}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <h4 style={{ marginBottom: '10px' }}>Selecionar barbeiro:</h4>
        <select className='dropdown-barbeiro' style={{ marginTop: '20px' }}>
          <option value=''>Escolha uma opção</option>
          {barbeiros.map((barbeiro, index) => (
            <option value={barbeiro.id} key={index}>{barbeiro.name}</option>
          ))}
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button className='btn-marcacao'>Confirmar marcação</button>
      </div>
    </div>
  );
          }