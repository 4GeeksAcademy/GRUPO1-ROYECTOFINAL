import React, { useState, useContext, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import '../../styles/CreatePost.css';
import imgForm from "../../img/img__form.jpg";
import { Context } from '../store/appContext';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import Swal from 'sweetalert2';

export const CreatePost = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const { postId } = useParams();
    const [formData, setFormData] = useState({
        titulo: '',
        subtitulo: '',
        descripcion: '',
        telefono: '',
        email: '',
        ubicacion: '',
        categoria: ''
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                const post = await actions.getPost(postId);
                if (post) {
                    setFormData({
                        titulo: post.title,
                        subtitulo: post.subtitle,
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
        let imageUrl = null;
        if (imageFile) {
            const uploadResult = await actions.uploadImageToCloudinary(imageFile);
            if (uploadResult) {
                imageUrl = uploadResult.secure_url;
            }
        }
        const postData = {
            title: formData.titulo,
            subtitle: formData.subtitulo,
            image: imageUrl,
            description: formData.descripcion,
            category: formData.categoria,
            type: "Donación"
        };

        const success = postId ? await actions.updatePost(postId, postData) : await actions.createPost(postData);
        if (success) {
            Swal.fire({
                icon: 'success',
                title: '¡Tu post fue creado de manera exitosa!',
                showConfirmButton: false,
                timer: 200
            });
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

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleBackClick = () => {
        navigate('/profile');
    };

    return (
        <div className='register__content__create'>
            <img className='img__form' src={imgForm} alt="Formulario" />
            <form className='register__form__add__post' onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className='register__title' style={{ fontSize: '2em' }}>Descripción de Donación</h1>
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={handleBackClick}
                        data-tooltip-id="backTooltip"
                        data-tooltip-content="Volver al perfil"
                    >
                        <FaArrowLeft size={24} />
                    </button>
                    <Tooltip id="backTooltip" place="bottom" effect="solid" className="custom-tooltip" />
                </div>

                <Row>
                    <Col>
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
                            minLength="4"
                            placeholder='Ingrese el subtítulo'
                            value={formData.subtitulo}
                            onChange={handleInputChange}
                        />

                        <label className='register__label' htmlFor="imagen">IMAGEN</label>
                        <input
                            className='register__input'
                            type="file"
                            name="imagen"
                            id="imagen"
                            onChange={handleImageChange}
                        />

                        <label className='register__label' htmlFor="descripcion">DESCRIPCIÓN</label>
                        <textarea
                            className='register__input'
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
                            <option value="Comida">Comida</option>
                            <option value="Servicios">Servicios</option>
                            <option value="otros">otros</option>
                        </select>
                    </Col>
                </Row>

                <div className="container-button">
                    <button className='register__button' type='submit'>{postId ? 'ACTUALIZAR' : 'CREAR'}</button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
