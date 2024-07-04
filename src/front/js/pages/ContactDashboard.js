import React, { useContext, useEffect, useState } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { Context } from '../store/appContext';
import { format } from 'date-fns';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';
import "../../styles/ContactDashboard.css";

const ContactDashboard = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    console.log('Renderizando ContactDashboard');

    useEffect(() => {
        console.log('useEffect para fetchData');
        const fetchData = async () => {
            if (store.token) {
                console.log('Fetching requests');
                const requests = await actions.getRequests();
                console.log('Fetched requests:', requests);
                console.log('Fetching sent requests');
                await actions.getSentRequests();
                console.log('Fetching contact request history');
                await actions.getContactRequestHistory();
                setLoading(false);
            }
        };

        fetchData();
    }, [store.token]);

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return format(new Date(dateString), 'dd/MM/yyyy HH:mm:ss');
    };

    const handleAccept = async (requestId) => {
        console.log(`Aceptando solicitud con ID: ${requestId}`);
        const request = store.requests.find(req => req.id === requestId);
        if (request) {
            sendEmail(request);
        } else {
            console.error('No se encontró la solicitud antes de aceptar');
            return;
        }
        const success = await actions.acceptRequest(requestId);
        console.log(`Resultado de aceptar solicitud: ${success}`);
        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Aceptaste la solicitud correctamente',
                text: 'Tenemos tu información y se la compartiremos al usuario',
                timer: 3000,
                showConfirmButton: false
            });
            console.log('Actualizando solicitudes y historial');
            await actions.getRequests();
            await actions.getContactRequestHistory();
        } else {
            console.error('No se pudo aceptar la solicitud');
        }
    };

    const sendEmail = (request) => {
        console.log('Enviando correo electrónico');
        const templateParams = {
            sender_email: request.sender.email,
            sender_name: request.sender.nombre,
            receiver_email: store.user.email,
            receiver_name: store.user.nombre,
            post_title: request.post.title,
            message: `Tu solicitud de contacto ha sido aceptada. Aquí tienes los datos del usuario que aceptó tu solicitud:
                Nombre: ${store.user.nombre}
                Email: ${store.user.email}
                Teléfono: ${store.user.telefono}`
        };
        console.log('Parámetros de la plantilla:', templateParams);

        emailjs.send('service_8cznlvo', 'template_2a4audk', templateParams, 'b6NNLnqS-HA4bOb2s')
            .then(response => {
                console.log('Correo enviado exitosamente', response.status, response.text);
            })
            .catch(err => {
                console.error('Error al enviar el correo', err);
            });
    };

    const handleReject = async (requestId) => {
        console.log(`Rechazando solicitud con ID: ${requestId}`);
        const success = await actions.rejectRequest(requestId);
        console.log(`Resultado de rechazar solicitud: ${success}`);
        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'Rechazaste correctamente la solicitud',
                timer: 3000,
                showConfirmButton: false
            });
            console.log('Actualizando solicitudes y historial');
            await actions.getRequests();
            await actions.getContactRequestHistory();
        } else {
            console.error('No se pudo rechazar la solicitud');
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
                <Spinner animation="border" role="status" className="spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="contendor-general-contact-dashboard">
            <Container className="mt-4">
                <h1 className="mb-4">Tus Solicitudes</h1>
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
                                                className="accept-button"
                                                onClick={() => handleAccept(request.id)}
                                            >
                                                Aceptar
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="reject-button"
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
                    <p className="default-text">No hay solicitudes de contacto recibidas.</p>
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
                    <p className="default-text">No hay solicitudes de contacto realizadas.</p>
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
                    <p className="default-text">No hay historial de operaciones.</p>
                )}
            </Container>
        </div>
    );
};

export default ContactDashboard;
