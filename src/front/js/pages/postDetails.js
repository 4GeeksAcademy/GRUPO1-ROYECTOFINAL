import React, { useContext, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { Context } from '../store/appContext';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

const Requests = ({ show, handleClose }) => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.token) {
            actions.getRequests();
            actions.getSentRequests();
            actions.getContactRequestHistory(); // Fetch the history
        }
    }, [store.token]);

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    };

    const handleAccept = async (requestId) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/contact-requests/${requestId}/accept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                }
            });

            if (response.ok) {
                const newRequests = store.requests.filter(request => request.id !== requestId);
                actions.setStore({ requests: newRequests });
                Swal.fire({
                    icon: 'success',
                    title: 'La solicitud fue aprobada con éxito',
                    showConfirmButton: false,
                    timer: 2000
                });
            } else {
                const errorMsg = await response.text();
                console.error("Error accepting request:", errorMsg);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al aprobar la solicitud',
                    text: errorMsg,
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            console.error("Error accepting request:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al aprobar la solicitud',
                text: error.message,
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    const handleReject = async (requestId) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/contact-requests/${requestId}/reject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                }
            });

            if (response.ok) {
                const newRequests = store.requests.filter(request => request.id !== requestId);
                actions.setStore({ requests: newRequests });
                Swal.fire({
                    icon: 'success',
                    title: 'La solicitud fue rechazada satisfactoriamente',
                    showConfirmButton: false,
                    timer: 2000
                });
            } else {
                const errorMsg = await response.text();
                console.error("Error rejecting request:", errorMsg);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al rechazar la solicitud',
                    text: errorMsg,
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al rechazar la solicitud',
                text: error.message,
                showConfirmButton: false,
                timer: 2000
            });
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>SOLICITUD</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Solicitudes Recibidas</h5>
                {store.requests && store.requests.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nombre del Solicitante</th>
                                <th>Imagen</th>
                                <th>Título</th>
                                <th>Fecha de Solicitud</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.requests.map(request => {
                                const post = request.post || {};
                                const sender = request.sender || {};
                                return (
                                    <tr key={request.id}>
                                        <td>{sender.nombre || 'Desconocido'}</td>
                                        <td>
                                            {post.image ? (
                                                <img src={post.image} alt={post.title} style={{ width: '50px' }} />
                                            ) : (
                                                'Sin imagen'
                                            )}
                                        </td>
                                        <td>{post.title || 'Sin título'}</td>
                                        <td>{formatDateTime(request.created_at)}</td>
                                        <td>
                                            <Button
                                                variant="primary"
                                                onClick={() => handleAccept(request.id)}
                                            >
                                                Aceptar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleReject(request.id)}
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
                                <th>Fecha de Solicitud</th>
                                <th>Estado</th>
                                <th>Fecha de Aprobación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.sentRequests.map(request => {
                                const post = request.post || {};
                                return (
                                    <tr key={request.id} className={request.status === 'Aprobada' ? 'table-success' : request.status === 'Rechazada' ? 'table-danger' : ''}>
                                        <td>
                                            {post.image ? (
                                                <img src={post.image} alt={post.title} style={{ width: '50px' }} />
                                            ) : (
                                                'Sin imagen'
                                            )}
                                        </td>
                                        <td>{post.title || 'Sin título'}</td>
                                        <td>{formatDateTime(request.created_at)}</td>
                                        <td>{request.status}</td>
                                        <td>{request.status === 'Aprobada' ? formatDateTime(request.approved_at) : 'N/A'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                ) : (
                    <p>No hay solicitudes de contacto realizadas.</p>
                )}

                <h5>Historial de Operaciones</h5>
                {store.contactRequestHistory && store.contactRequestHistory.length > 0 ? (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Operación</th>
                                <th>Fecha de Aprobación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.contactRequestHistory.map(history => (
                                <tr key={history.id}>
                                    <td>{history.action}</td>
                                    <td>{formatDateTime(history.approved_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No hay historial de operaciones.</p>
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
