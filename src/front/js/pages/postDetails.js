import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import '../../styles/postDetails.css';
import { Context } from '../store/appContext';

const PostDetails = () => {
    const { store, actions } = useContext(Context);
    const { postId } = useParams();
    const [hasContactRequest, setHasContactRequest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            await actions.getPost(postId);
            setLoading(false);
        };
        fetchPost();
    }, [postId]);

    useEffect(() => {
        const checkContactRequest = async () => {
            if (store.user && store.currentPost) {
                const requests = await actions.getRequests();
                const requestExists = requests.some(request => request.post_id === store.currentPost.id && request.sender_id === store.user.id);
                setHasContactRequest(requestExists);
            }
        };
        checkContactRequest();
    }, [store.user, store.currentPost]);

    const post = store.currentPost;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
                <Spinner animation="border" role="status" className="spinner">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    const handleContact = async () => {
        const request = {
            receiver_id: post.user_id,
            post_id: postId,
            message: "Estoy interesado en este post"
        };
        const success = await actions.createContactRequest(request);
        if (success) {
            alert("Solicitud de contacto enviada con éxito");
            setHasContactRequest(true);
        } else {
            alert("Error al enviar la solicitud de contacto");
        }
    };

    return (
        <Container className="post-details-container">
            <Card className="post-details-card">
                <Row noGutters={true}>
                    <Col md={6}>
                        <Card.Img variant="top" src={post.image} className="post-details-card-img" />
                    </Col>
                    <Col md={6} className='details__center'>
                        <Card.Body className="post-details-card-body">
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{post.subtitle}</Card.Subtitle>
                            <ul className="post-details-list">
                                <li>{post.description}</li>
                                <li><strong>Categoria:</strong> {post.category}</li>
                                <li><strong>GRATIS | </strong> {post.type}</li>
                            </ul>
                            {hasContactRequest ? (
                                <p>Tu solicitud ya fue enviada, te avisaremos cuando sea aprobada por el autor.</p>
                            ) : (
                                <Button className="contact-button" onClick={handleContact}>Contactar</Button>
                            )}
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default PostDetails;
