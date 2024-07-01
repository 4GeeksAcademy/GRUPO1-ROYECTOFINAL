import React, { useContext, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FaHeart, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../styles/userPosts.css";
import { Context } from "../store/appContext";

const UserPosts = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.user) {
            actions.getPostsByUser();
        }
    }, [store.user]);

    const handleCardClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const handleEditClick = (e, post) => {
        e.stopPropagation();
        actions.setCurrentPost(post);
        navigate(`/edit-post/${post.id}`);
    };

    const handleDeleteClick = async (e, postId) => {
        e.stopPropagation();
        const confirmDelete = window.confirm("¿Estás seguro que deseas eliminar el Post?");
        if (confirmDelete) {
            await actions.deletePost(postId);
            actions.getPostsByUser(); // Volver a cargar los posts después de eliminar
        }
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
                <h2 className="text-center mb-4 title-posts">Tus Publicaciones</h2>
                <Row className="articles">
                    {store.posts.length > 0 ? store.posts.map((post, index) => (
                        <Col key={index} md={4}>
                            <Card className="user-post-card" onClick={() => handleCardClick(post.id)}>
                                <div className="card-icons">
                                    <FaPencilAlt
                                        className="edit-icon"
                                        onClick={(e) => handleEditClick(e, post)}
                                    />
                                    <FaTrashAlt
                                        className="delete-icon"
                                        onClick={(e) => handleDeleteClick(e, post.id)}
                                    />
                                </div>
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

export default UserPosts;
