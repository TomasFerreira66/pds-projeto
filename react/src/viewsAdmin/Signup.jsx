import { Link } from 'react-router-dom';
import { createRef, useState } from 'react';
import axiosClient from '../axios-client.js';
import { useStateContext } from '../contexts/ContextProvider.jsx';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const passwordConfirmationRef = createRef();
  const tipoRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const {setNotification} = useStateContext()

  const onSubmit = ev => {
    ev.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
      tipo: 'Cliente',
    };

    axiosClient
      .post('/signup', payload)
      .then(({ data }) => {
        // Armazenar os dados do usuário e o token em variáveis locais
        const { user, token } = data;

        // Limpar os campos do formulário
        nameRef.current.value = '';
        emailRef.current.value = '';
        passwordRef.current.value = '';
        passwordConfirmationRef.current.value = '';

        // Exibir mensagem de sucesso ou realizar outras ações necessárias
        console.log('Registro bem-sucedido!');
        setNotification('Marcação criada com sucesso');
        navigate('/login');

      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <img src="../src/img/IPCA-BarberShop.png" alt="IPCA Barber Shop" className="imagem-login" />
          <h1 className="title">Criar conta</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={nameRef} type="text" placeholder="Nome" />
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Palavra-passe" />
          <input ref={passwordConfirmationRef} type="password" placeholder="Confirmar palavra-passe" />

          <button className="btn btn-block">Seguinte</button>
          <p className="message">
            Já tem conta? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}