import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/userPosts.css";
import { Context } from "../store/appContext";

const AllPosts = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            await actions.getAllPostsUnrestricted();
            setLoading(false);
        };
        fetchPosts();
    }, []);

    const handleCardClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleFavoriteClick = (e, postId) => {
        e.stopPropagation();
        if (isFavorite(postId)) {
            actions.removeFavorite(postId);
        } else {
            actions.addFavorite(postId);
        }
    };

    const isFavorite = (postId) => {
        return store.favorites.some(fav => fav.post.id === postId);
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
        <div className="user-posts-main-container">
            <div className="user-posts-container">
                <h2 className="text-center mb-4 title-posts">¡Encuentra lo que necesitas!</h2>
                <h4 className="text-center mb-4 subtitle-posts">Solicita contacto y coordina con el oferente.</h4>
                <Row className="articles">
                    {store.posts.length > 0 ? store.posts.map((post, index) => (
                        <Col key={index} md={4}>
                            <Card className="user-post-card" onClick={() => handleCardClick(post.id)}>
                                <Card.Img variant="top" src={post.image} className="user-post-card-img" />
                                <Card.Body className="user-post-card-body">
                                    <section className="parrafos">
                                        <Card.Title className="item-card2">{post.title}</Card.Title>
                                        <Card.Text className="item-card">{post.description}</Card.Text>
                                        <Card.Text className="item-card"><small className="text-muted">{post.subtitle}</small></Card.Text>
                                    </section>
                                    <section className="heart__icon">
                                        <FaHeart
                                            className={`favorite-icon ${isFavorite(post.id) ? 'favorite-icon-active' : ''}`}
                                            onClick={(e) => handleFavoriteClick(e, post.id)}
                                        />
                                    </section>
                                </Card.Body>
                            </Card>
                        </Col>
                    )) : (
                        <p className="text-center">Aún no hay post creados</p>
                    )}
                </Row>
            </div>
        </div>
    );
};

export default AllPosts;
