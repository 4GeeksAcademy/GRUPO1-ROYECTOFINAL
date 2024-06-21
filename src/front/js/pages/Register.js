import React, { useState, useContext } from 'react';
import '../../styles/Register.css';
import registerIMG from '../../img/register.png';
import { Link, useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

export const Register = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.registerUser(formData);
        if (success) {
            navigate('/');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'telefono' ? value.replace(/\D/g, '').slice(0, 11) : value,
        });
    };

    return (
        <div className='register__content'>
            <figure className='register__img'>
                <img className='register__img__portada' src={registerIMG} alt="Imagen de registro" />
            </figure>
            <form className='register__form' onSubmit={handleSubmit}>
                <h1 className='register__title'>REGISTER</h1>
                <label className='register__label' htmlFor="nombre">NOMBRE DE USUARIO</label>
                <input
                    className='register__input'
                    type="text"
                    name="nombre"
                    id="nombre"
                    required
                    placeholder='Ingrese su nombre'
                    minLength="4"
                    value={formData.nombre}
                    onChange={handleInputChange}
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
                <label className='register__label' htmlFor="password">CONTRASEÑA</label>
                <input
                    className='register__input'
                    type="password"
                    name="password"
                    id="password"
                    required
                    minLength="6"
                    placeholder='Ingrese una contraseña'
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <div className="button-container">
                    <button className='register__button' type='submit'>REGISTRARSE</button>
                </div>
                <Link to="/login" className='register__link-cuenta'>¿Ya tienes una cuenta?</Link>
            </form>
        </div>
    );
};
