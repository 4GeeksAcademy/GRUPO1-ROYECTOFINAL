import React, { useContext, useState } from 'react';
import '../../styles/Login.css';
import loginIMG from '../../img/register.png';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import Swal from 'sweetalert2';

export const Login = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await actions.loginUser({ email, password });
    if (success) {
      const userName = store.user?.nombre || 'Usuario';
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenidx ${userName}!`,
        text: 'Iniciaste sesión correctamente',
        showConfirmButton: false,
        timer: 2000
      });
      console.log("Login successful, redirecting...");
      navigate('/');
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Credenciales incorrectas, por favor intente de nuevo.',
        showConfirmButton: true,
      });
      setError('Credenciales incorrectas, por favor intente de nuevo.');
    }
  };

  return (
    <div className='login__content'>
      <figure className='login__img'>
        <img className='login__img__portada' src={loginIMG} alt="Imagen de registro" />
      </figure>
      <form className='login__form' onSubmit={handleSubmit}>
        <h1 className='login__title'>LOGIN</h1>
        {error && <p className="alert alert-danger">{error}</p>}
        <label className='login__label' htmlFor="email">EMAIL</label>
        <input
          className='login__input'
          type="email"
          name="email"
          id="email"
          required
          minLength="6"
          placeholder='Ingrese email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className='login__label' htmlFor="password_login">CONTRASEÑA</label>
        <input
          className='login__input'
          type="password"
          name="password_login"
          id="password_login"
          required
          minLength="6"
          placeholder='Ingrese contraseña'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className='login__button' type='submit'>INGRESAR</button>
        <Link to="/register" className='login__link-cuenta'>¿No tienes una cuenta?</Link>
      </form>
    </div>
  );
};
