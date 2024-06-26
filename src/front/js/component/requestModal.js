import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { useContext } from 'react';
import { Context } from '../store/appContext';

const RequestsModal = ({ show, handleClose }) => {
    const { store, actions } = useContext(Context);

    const handleAccept = (requestId) => {
        actions.acceptRequest(requestId);
    };

    const handleReject = (requestId) => {
        actions.rejectRequest(requestId);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Solicitudes de Contacto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {store.requests.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Título del Post</th>
                                <th>Mensaje</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.post.title}</td>
                                    <td>{request.message}</td>
                                    <td>
                                        <Button variant="success" onClick={() => handleAccept(request.id)}>Aceptar</Button>
                                        <Button variant="danger" onClick={() => handleReject(request.id)}>Rechazar</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No hay solicitudes de contacto.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default RequestsModal;
