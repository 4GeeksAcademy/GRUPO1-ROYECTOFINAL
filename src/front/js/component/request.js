import React, { useContext, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Context } from '../store/appContext';

const Requests = ({ show, handleClose }) => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.token) {
            actions.getRequests();
        }
    }, [store.token]);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Solicitudes de Contacto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Solicitudes Recibidas</h5>
                {store.requests && store.requests.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Título</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.requests.map(request => {
                                const post = request.post || {};
                                return (
                                    <tr key={request.id}>
                                        <td>
                                            {post.image ? (
                                                <img src={post.image} alt={post.title} style={{ width: '50px' }} />
                                            ) : (
                                                'Sin imagen'
                                            )}
                                        </td>
                                        <td>{post.title || 'Sin título'}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                onClick={() => actions.acceptRequest(request.id)}
                                            >
                                                Aceptar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => actions.rejectRequest(request.id)}
                                            >
                                                Rechazar
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                ) : (
                    <p>No hay solicitudes de contacto recibidas.</p>
                )}

                <h5>Solicitudes Realizadas</h5>
                {store.sentRequests && store.sentRequests.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Título</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.sentRequests.map(request => {
                                const post = request.post || {};
                                return (
                                    <tr key={request.id}>
                                        <td>
                                            {post.image ? (
                                                <img src={post.image} alt={post.title} style={{ width: '50px' }} />
                                            ) : (
                                                'Sin imagen'
                                            )}
                                        </td>
                                        <td>{post.title || 'Sin título'}</td>
                                        <td>{request.status}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                ) : (
                    <p>No hay solicitudes de contacto realizadas.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Requests;
