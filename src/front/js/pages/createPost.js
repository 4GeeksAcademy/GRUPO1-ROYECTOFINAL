import React, { useState, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../../styles/Register.css';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

export const CreatePost = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        titulo: '',
        subtitulo: '',
        imagen: '',
        descripcion: '',
        telefono: '',
        email: '',
        ubicacion: '',
        categoria: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.createPost({
            title: formData.titulo,
            subtitle: formData.subtitulo,
            image: formData.imagen,
            description: formData.descripcion,
            category: formData.categoria,
            type: "Donación"  // asumiendo que esto es un post de donación
        });
        if (success) {
            navigate('/user-posts');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
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
                            placeholder='Ingrese el título'
                            minLength="4"
                            value={formData.titulo}
                            onChange={handleInputChange}
                        />

                        <label className='register__label' htmlFor="subtitulo">SUBTÍTULO</label>
                        <input
                            className='register__input'
                            type="text"
                            name="subtitulo"
                            id="subtitulo"
                            required
                            placeholder='Ingrese el subtítulo'
                            value={formData.subtitulo}
                            onChange={handleInputChange}
                        />

                        <label className='register__label' htmlFor="imagen">IMAGEN</label>
                        <input
                            className='register__input'
                            type="text"
                            name="imagen"
                            id="imagen"
                            required
                            placeholder='Ingrese la URL de la imagen'
                            value={formData.imagen}
                            onChange={handleInputChange}
                        />

                        <label className='register__label' htmlFor="descripcion">DESCRIPCIÓN</label>
                        <textarea
                            className='register__input'
                            name="descripcion"
                            id="descripcion"
                            required
                            placeholder='Ingrese la descripción'
                            value={formData.descripcion}
                            onChange={handleInputChange}
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
                            value={formData.telefono}
                            onChange={handleInputChange}
                        />

                        <label className='register__label' htmlFor="email">EMAIL</label>
                        <input
                            className='register__input'
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder='Ingrese un email'
                            value={formData.email}
                            onChange={handleInputChange}
                        />

                        <label className='register__label' htmlFor="ubicacion">UBICACIÓN</label>
                        <input
                            className='register__input'
                            type="text"
                            name="ubicacion"
                            id="ubicacion"
                            required
                            placeholder='Ingrese la ubicación'
                            value={formData.ubicacion}
                            onChange={handleInputChange}
                        />

                        <label className='register__label' htmlFor="categoria">CATEGORÍA</label>
                        <select className='register__input' name="categoria" id="categoria" required value={formData.categoria} onChange={handleInputChange}>
                            <option value="">Seleccione una categoría</option>
                            <option value="Electrodomésticos">Electrodomésticos</option>
                            <option value="Muebles">Muebles</option>
                            <option value="Vestimenta">Vestimenta</option>
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
