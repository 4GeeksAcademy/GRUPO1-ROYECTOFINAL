import React, { useContext, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/userPosts.css";
import { Context } from "../store/appContext";

const UserPosts = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getPosts();
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

    return (
        <div className="user-posts-main-container">
            <div className="user-posts-container">
                <h2 className="text-center mb-4">Productos Publicados</h2>
                <Row>
                    {store.posts.length > 0 ? store.posts.map((post, index) => (
                        <Col key={index} md={4}>
                            <Card className="user-post-card" onClick={() => handleCardClick(post.id)}>
                                <Card.Img variant="top" src={post.image} className="user-post-card-img" />
                                <Card.Body className="user-post-card-body">
                                    <Card.Title>{post.title}</Card.Title>
                                    <Card.Text className="item-card">{post.description}</Card.Text>
                                    <Card.Text className="item-card"><small className="text-muted">{post.subtitle}</small></Card.Text>
                                    <FaHeart 
                                        className={`favorite-icon ${isFavorite(post.id) ? 'favorite-icon-active' : ''}`}
                                        onClick={(e) => handleFavoriteClick(e, post.id)}
                                    />
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

export default UserPosts;
