import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import DateTime from 'react-datetime';
import { useNavigate } from 'react-router-dom';

export default function NovaMarcacao() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState('');
  const [errors, setErrors] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [dataHoraSelecionada, setDataHoraSelecionada] = useState(new Date());
  const [marcacao, setMarcacao] = useState({
    id: null,
    servico: '', // iniciando com uma string vazia
    data: '', 
    idBarbeiro: '',
    idCliente: ''
  })

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

  const onSubmit = ev => {
    ev.preventDefault();
    // adicionando o valor de 'servico' ao estado da marcação antes de enviar a solicitação de criação
    setMarcacao(prevMarcacao => ({
      ...prevMarcacao,
      servico: document.querySelector('.dropdown-servico').value
    }));
    axiosClient.post('/marcacoes', marcacao)
      .then(() => {
        setNotification('User was successfully created')
        navigate('/marcacoes')
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
  }

  return (
    <form onSubmit={onSubmit}>
    <div className='card animated fadeInDown' style={{ marginLeft: '100px', marginRight: '100px' }}>
    <h2>Agendar uma marcação</h2>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
    <br /><br />
    <h4 style={{ marginBottom: '10px' }}>Selecionar serviço:</h4>
    <select className='dropdown-servico' style={{ marginTop: '20px' }} onChange={(ev) => {
    setMarcacao({...marcacao, servico: ev.target.value});
    getBarbeirosEspecialidade(ev.target.value);
    }}>
    <option value="">Escolha uma opção</option>
    {especialidades.map((especialidade, index) => (
    <option value={especialidade} key={index}>{especialidade}</option>
    ))}
    </select>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
    <h4 style={{ marginBottom: '10px' }}>Selecionar barbeiro:</h4>
    <select className='dropdown-barbeiro' style={{ marginTop: '20px' }} onChange={(ev) => setMarcacao({...marcacao, idBarbeiro: ev.target.value})}>
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
    <button className='btn-marcacao'>Confirmar marcação</button>
    </div>
    </div>
    </form>
    );
    }