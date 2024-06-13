import React from 'react';
import '../../styles/Register.css';
import registerIMG from  '../../img/register.png'


export const Register = () => {


  const handleSubmit = (e) => {
    e.preventDefault();
    //manejar el evento
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefono') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 11);
      e.target.value = formattedValue;
    }
  };

  return (
    <div className='register__content'>
      <figure className='register__img'>
        <img className='register__img__portada' src={registerIMG} alt="Imagen de registro" />
      </figure>

      <form className='register__form' onSubmit={handleSubmit}>
        <h1 className='register__title'>REGÍSTRATE</h1>

        <label className='register__label' htmlFor="nombre">NOMBRE DE USUARIO</label>
        <input
          className='register__input'
          type="text"
          name="nombre"
          id="nombre"
          required
          placeholder='Ingrese nombre'
        />

        <label className='register__label' htmlFor="telefono">TELÉFONO</label>
        <input
          className='register__input'
          type="text"
          name="telefono"
          id="telefono"
          maxLength="11"
          required
          placeholder='Ingrese su número de celular'
          onChange={handleInputChange}
        />

        <label className='register__label' htmlFor="email">EMAIL</label>
        <input
          className='register__input'
          type="email"
          name="email"
          id="email"
          required
          placeholder='Ingrese email'
        />

        <label className='register__label' htmlFor="password_register">CONTRASEÑA</label>
        <input
          className='register__input'
          type="password"
          name="password_register"
          id="password_register"
          required
          placeholder='Crea una contraseña'
        />

        <label className='register__label' htmlFor="password_register2">CONFIRMAR CONTRASEÑA</label>
        <input
          className='register__input'
          type="password"
          name="password_register2"
          id="password_register2"
          required
          placeholder='Ingrese contraseña'
        />

        <button className='register__button' type='submit'>REGISTRAR</button>
      </form>
    </div>
  );
};


// BACKGROUND: #  #F9F3EC

// COLOR DE TEXTO: #41403E  

// COLOR DE TEXTO - SECUNDARIO(DECORATIVO) :  DEAD6F            


// CONTORNOS : #606060

// D95383