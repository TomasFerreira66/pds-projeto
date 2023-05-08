import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import DateTime from 'react-datetime';
export default function marcacoes() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [dataHoraSelecionada, setDataHoraSelecionada] = useState([]);

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
      <h2>Agendar uma marcação</h2>
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <h4 style={{ marginBottom: '10px' }}>Selecionar data e hora:</h4>
        <DateTime 
            className='dropdown-horario'
            onChange={(date) => setDataHoraSelecionada(date)}
            value={dataHoraSelecionada}
            dateFormat="DD/MM/YYYY HH:mm"
            minDate={new Date()} 
            maxDate={new Date('2030-12-31')}
            timeConstraints={{ minutes: { step: 30 } }}
            />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <button type='submit' className='btn-marcacao'>Confirmar marcação</button>
      </div>
    </div>
  );
          }