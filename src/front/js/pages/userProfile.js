import React, { useContext, useState, useEffect } from 'react';
import { Card, Image, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { FaPencilAlt, FaEnvelope } from 'react-icons/fa';
import '../../styles/userProfile.css';
import UserPosts from '../component/userPosts';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import Requests from '../component/request';

const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const [showRequestsModal, setShowRequestsModal] = useState(false);
    const [userData, setUserData] = useState({
        nombre: store.user?.nombre || '',
        telefono: store.user?.telefono || '',
        email: store.user?.email || ''
    });

    useEffect(() => {
        if (store.token && store.user) {
            actions.getPostsByUser(store.user.id);
        }
    }, [store.token, store.user]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleRequestsShow = () => setShowRequestsModal(true);
    const handleRequestsClose = () => setShowRequestsModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.updateUser(userData);
        if (success) {
            handleClose();
        }
    };

    const userDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet accumsan tortor. Nulla facilisi. Nullam ultricies, justo at convallis mollis, nunc ex feugiat odio, et accumsan ipsum nulla ut quam. Phasellus interdum, justo eget aliquet maximus, turpis nulla sollicitudin felis, ut vehicula justo quam ut urna.";

    return (
        <>
            <div className="user-profile-background">
                <Card className="user-profile-card">
                    <div className="user-image-container">
                        <Image src="https://res.cloudinary.com/djpifu0cl/image/upload/v1718598453/4geeks_cm8jnn.webp" roundedCircle className="user-image" />
                    </div>
                    <div className="button-container-create">
                        <Link to="/create-post">
                            <Button className="add-button">Agregar Donación</Button>
                        </Link>
                        <Button className="edit-button" variant="light" onClick={handleShow}><FaPencilAlt /></Button>
                    </div>
                    <div className="message-button-container">
                        <Button className="message-button" variant="light" onClick={handleRequestsShow}><FaEnvelope /></Button>
                        <span className="notification-badge">{store.requests.length}</span>
                    </div>
                    <Card.Body className="user-profile-body">
                        <Card.Title className="text-center">{store.user?.nombre || 'Nombre del Usuario'}</Card.Title>
                        <Card.Subtitle className="mb-2 text-center text-muted">{store.user?.email || 'Email del Usuario'}</Card.Subtitle>
                        <Row className="text-center user-stats">
                            <Col className="user-stat">
                                <div className="user-stat-number">{store.posts.length}</div>
                                PUBLICACIONES
                            </Col>
                            <Col className="user-stat">
                                <div className="user-stat-number">{store.favorites.length}</div>
                                FAVORITOS
                            </Col>
                            <Col className="user-stat">
                                <div className="user-stat-number">{store.requests.length}</div>
                                SOLICITUDES
                            </Col>
                        </Row>
                        <Card.Text className="text-center card-text">
                            {userDescription.substring(0, 200)}...
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <UserPosts />

            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="modal-title">Editar Perfil</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} className="update-user-form">
                        <Form.Group controlId="formNombre" className="input-custom">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="nombre"
                                value={userData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTelefono" className="input-custom">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={userData.telefono}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="input-custom">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3 update-button">
                            Guardar Cambios
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Requests show={showRequestsModal} handleClose={handleRequestsClose} />
        </>
    );
};

export default UserProfile;
