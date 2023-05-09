import React, { useState, useEffect } from 'react';
import axiosClient from '../axios-client';
import { useNavigate, useParams } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function NovaMarcacao() {
  const navigate = useNavigate();
  const {setNotification} = useStateContext()
  const [errors, setErrors] = useState(null)
  const [barbeiros, setBarbeiros] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const {id} = useParams();
  const [dataHoraSelecionada, setDataHoraSelecionada] = useState(new Date());
  
  const [marcacao, setMarcacao] = useState({
    id: null,
    servico: '', 
    data: new Date(), 
    idBarbeiro: '',
    idCliente: id,
  })
  
  useEffect(() => {
    getBarbeiros();
    getEspecialidades();
  }, [])

  const mudarData = (ev) => {
    setDataHoraSelecionada(ev);
    setMarcacao({ ...marcacao, data: new Date(ev)});
    
    }

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
    setMarcacao({ ...marcacao, data: new Date( document.querySelector('.dropdown-horario').value) });
    setMarcacao(prevMarcacao => ({
      ...prevMarcacao,
      servico: document.querySelector('.dropdown-servico').value,
      data:new Date( document.querySelector('.dropdown-horario').value),
       
    }));

    axiosClient.post('/marcacoes', marcacao)
      .then(() => {
        setNotification('Marcação criada com sucesso')
        navigate('/paginainicial')
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
  }

  return (
    <>
    <div className='cardd animated fadeInDown'>
      {loading && (
        <div className='text-center'>
          Loading...
        </div>
      )}
      {errors &&
      <div className='alert'>
        {Object.keys(errors).map(key => (
          <p key={key}>{errors[key][0]}</p>
          ))}
          </div>
          }
        {!loading && (
          <form onSubmit={onSubmit}>
          <div className='card animated fadeInDown' style={{ marginLeft: '100px', marginRight: '100px' }}>
            <h2>Agendar uma marcação</h2>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <br /><br />
              <h4 style={{ marginBottom: '10px' }}>Selecionar serviço:</h4>
              <select className='dropdown-servico' style={{ marginTop: '20px' }} onChange={(ev) => {
                setMarcacao({ ...marcacao, servico: ev.target.value });
                getBarbeirosEspecialidade(ev.target.value);
              }}>
                <option value="">Escolha uma opção</option>
                {especialidades.map((especialidade, index) => (
                  <option value={especialidade} key={index}>
                    {especialidade}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Selecionar barbeiro:</h4>
              <select className='dropdown-barbeiro' style={{ marginTop: '20px' }} onChange={(ev) => setMarcacao({ ...marcacao, idBarbeiro: ev.target.value })}>
                <option value=''>Escolha uma opção</option>
                {barbeiros.map((barbeiro, index) => (
                  <option value={barbeiro.id} key={index}>
                    {barbeiro.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '20px', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '10px' }}>Selecionar data e hora:</h4>
              <DatePicker 
              style={{ width:'300px' }}
              className='dropdown-horario'
              selected={dataHoraSelecionada}
              onChange={(date) => mudarData(date)}
              showTimeSelect
              timeIntervals={30}
              timeFormat="HH:mm"
              dateFormat="dd/MM/yyyy HH:mm"
              minDate={new Date()}
              maxDate={new Date('2030-12-31')}
              minTime={new Date().setHours(9, 0)}
              maxTime={new Date().setHours(17, 30)}
            />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <button className='btn-marcacao'>Confirmar marcação</button>
            </div>
          </div>
        </form>
        )}
    </div>
    </>
  )
}