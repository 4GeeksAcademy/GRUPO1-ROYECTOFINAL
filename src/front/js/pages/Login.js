import React from 'react';
import '../../styles/Login.css';
import loginIMG from  '../../img/register.png'
import { Link } from 'react-router-dom';

export const Login = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        //manejar el evento
      };
    
    
      return (
        <div className='login__content'>
          <figure className='login__img'>
            <img className='login__img__portada' src={loginIMG}  alt="Imagen de registro" />
          </figure>
    
          <form className='login__form' onSubmit={handleSubmit}>
            <h1 className='login__title'>LOGIN</h1>
    
    
            <label className='login__label' htmlFor="email">EMAIL</label>
            <input
              className='login__input'
              type="email"
              name="email"
              id="email"
              required
               minLength="6"
              placeholder='Ingrese email'
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
            />
    
            <button className='login__button' type='submit'>INGRESAR</button>
            <Link to="/register" className='login__link-cuenta'>¿No tienes una cuenta?</Link>
          </form>  
        </div>
      );
}
