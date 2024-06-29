import React, { useState, useContext, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../../styles/CreatePost.css';
import imgForm from "../../img/img__form.jpg"
import { Context } from '../store/appContext';
import { useNavigate, useParams } from 'react-router-dom';

export const CreatePost = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { postId } = useParams();
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

    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                const post = await actions.getPost(postId);
                if (post) {
                    setFormData({
                        titulo: post.title,
                        subtitulo: post.subtitle,
                        imagen: post.image,
                        descripcion: post.description,
                        telefono: post.telefono,
                        email: post.email,
                        ubicacion: post.ubicacion,
                        categoria: post.category
                    });
                }
            };
            fetchPost();
        }
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            title: formData.titulo,
            subtitle: formData.subtitulo,
            image: formData.imagen,
            description: formData.descripcion,
            category: formData.categoria,
            type: "Donación"
        };

        const success = postId ? await actions.updatePost(postId, postData) : await actions.createPost(postData);
        if (success) {
            navigate('/profile');
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
        <div className='registerpostcreate__content__create'>
            <img className='img__form' src={imgForm}></img>
            <form className='registerpostcreate__form__add__post' onSubmit={handleSubmit}>
                <h1 className='registerpostcreate__title'>Descripción de Donación</h1>

                <Row>
                    <Col>
                        <label className='registerpostcreate__label' htmlFor="titulo">TÍTULO</label>
                        <input
                            className='registerpostcreate__input'
                            type="text"
                            name="titulo"
                            id="titulo"
                            required
                            placeholder='Ingrese el título'
                            minLength="4"
                            value={formData.titulo}
                            onChange={handleInputChange}
                        />

                        <label className='registerpostcreate__label' htmlFor="subtitulo">SUBTÍTULO</label>
                        <input
                            className='registerpostcreate__input'
                            type="text"
                            name="subtitulo"
                            id="subtitulo"
                            required
                            minLength="4"
                            placeholder='Ingrese el subtítulo'
                            value={formData.subtitulo}
                            onChange={handleInputChange}
                        />

                        <label className='registerpostcreate__label' htmlFor="imagen">IMAGEN</label>
                        <input
                            className='registerpostcreate__input'
                            type="text"
                            name="imagen"
                            id="imagen"
                            required
                            placeholder='Ingrese la URL de la imagen'
                            value={formData.imagen}
                            onChange={handleInputChange}
                        />

                        <label className='registerpostcreate__label' htmlFor="descripcion">DESCRIPCIÓN</label>
                        <textarea
                            className='registerpostcreate__input'
                            name="descripcion"
                            id="descripcion"
                            required
                            minLength="10"
                            placeholder='Ingrese la descripción'
                            value={formData.descripcion}
                            onChange={handleInputChange}
                        ></textarea>
                    </Col>

                    <Col>
                        <label className='registerpostcreate__label' htmlFor="telefono">TELÉFONO</label>
                        <input
                            className='registerpostcreate__input'
                            type="text"
                            name="telefono"
                            id="telefono"
                            required
                            placeholder='Ingrese su número de celular'
                            value={formData.telefono}
                            onChange={handleInputChange}
                        />

                        <label className='registerpostcreate__label' htmlFor="email">EMAIL</label>
                        <input
                            className='registerpostcreate__input'
                            type="email"
                            name="email"
                            id="email"
                            required
                            placeholder='Ingrese un email'
                            value={formData.email}
                            onChange={handleInputChange}
                        />

                        <label className='registerpostcreate__label' htmlFor="ubicacion">UBICACIÓN</label>
                        <input
                            className='registerpostcreate__input'
                            type="text"
                            name="ubicacion"
                            id="ubicacion"
                            required
                            placeholder='Ingrese la ubicación'
                            value={formData.ubicacion}
                            onChange={handleInputChange}
                        />

                        <label className='registerpostcreate__label' htmlFor="categoria">CATEGORÍA</label>
                        <select className='registerpostcreate__input' name="categoria" id="categoria" required value={formData.categoria} onChange={handleInputChange}>
                            <option value="">Seleccione una categoría</option>
                            <option value="Electrodomésticos">Electrodomésticos</option>
                            <option value="Muebles">Muebles</option>
                            <option value="Vestimenta">Vestimenta</option>
                            <option value="Comida">Comida</option>
                            <option value="Servicios">Servicios</option>
                            <option value="otros">otros</option>
                        </select>
                    </Col>
                </Row>

                <div className="container-button">
                    <button className='registerpostcreate__button' type='submit'>{postId ? 'ACTUALIZAR' : 'CREAR'}</button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
