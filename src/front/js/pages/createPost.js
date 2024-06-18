import React from 'react';
import { Row, Col } from 'react-bootstrap';
import '../../styles/Register.css';

export const CreatePost = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    // Manejar el evento
    history.push('/');
  };

  return (
    <div className='register__content__create'>
      <form className='register__form__add__post' onSubmit={handleSubmit}>
        <h1 className='register__title'>Agregá tu donación</h1>

        <Row>
          <Col md={6}>
            <label className='register__label' htmlFor="titulo">TÍTULO</label>
            <input
              className='register__input'
              type="text"
              name="titulo"
              id="titulo"
              required
              placeholder='Ingrese el título' minLength="4"
            />

            <label className='register__label' htmlFor="subtitulo">SUBTÍTULO</label>
            <input
              className='register__input'
              type="text"
              name="subtitulo"
              id="subtitulo"
              required
              placeholder='Ingrese el subtítulo'
            />

<label className='register__label' htmlFor="imagen">IMAGEN</label>
            <input
              className='register__input'
              type="text"
              name="imagen"
              id="imagen"
              required
              placeholder='Ingrese la URL de la imagen'
            />

            <label className='register__label' htmlFor="descripcion">DESCRIPCIÓN</label>
            <textarea
              className='register__input'
              name="descripcion"
              id="descripcion"
              required
              placeholder='Ingrese la descripción'
            ></textarea>

    
          </Col>

         

          <Col md={6}>
            <label className='register__label' htmlFor="telefono">TELÉFONO</label>
            <input
              className='register__input'
              type="text"
              name="telefono"
              id="telefono"
              required
              placeholder='Ingrese su número de celular'
            />

            <label className='register__label' htmlFor="email">EMAIL</label>
            <input
              className='register__input'
              type="email"
              name="email"
              id="email"
              required
              placeholder='Ingrese un email'
            />

            <label className='register__label' htmlFor="ubicacion">UBICACIÓN</label>
            <input
              className='register__input'
              type="text"
              name="ubicacion"
              id="ubicacion"
              required
              placeholder='Ingrese la ubicación'
            />

            <label className='register__label' htmlFor="categoria">CATEGORÍA</label>
            <select className='register__input' name="categoria" id="categoria" required>
              <option value="">Seleccione una categoría</option>
              <option value="donacion">Donación</option>
              <option value="venta">Venta</option>
              <option value="intercambio">Intercambio</option>
            </select>
          </Col>
        </Row>

        <div className="container-button">
            <button className='register__button' type='submit'>CREAR</button>      
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
