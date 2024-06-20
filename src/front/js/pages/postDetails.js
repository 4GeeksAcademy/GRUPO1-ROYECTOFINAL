import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import '../../styles/postDetails.css';
import { Context } from '../store/appContext';

const PostDetails = () => {
    const { store, actions } = useContext(Context);
    const { postId } = useParams();

    useEffect(() => {
        actions.getPost(postId);
    }, [postId]);

    const post = store.currentPost;

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <Container className="post-details-container">
            <Card className="post-details-card">
                <Row noGutters>
                    <Col md={6}>
                        <Card.Img variant="top" src={post.image} className="post-details-card-img" />
                    </Col>
                    <Col md={6}>
                        <Card.Body className="post-details-card-body">
                            <Card.Title>{post.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{post.subtitle}</Card.Subtitle>
                            <ul className="post-details-list">
                                <li>{post.description}</li>
                                <li><strong>Category:</strong> {post.category}</li>
                                <li><strong>Type:</strong> {post.type}</li>
                            </ul>
                            <Button variant="primary" className="contact-button">Contactar</Button>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default PostDetails;
