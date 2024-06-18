import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import '../../styles/userPosts.css';

const UserPosts = () => {
  const posts = [
    {
      title: "Post 1",
      description: "Descripción del producto 1",
      date: "2024-06-01",
      image: "https://via.placeholder.com/75"
    },
    {
      title: "Post 2",
      description: "Descripción del producto 2",
      date: "2024-06-02",
      image: "https://via.placeholder.com/75"
    },
    {
      title: "Post 3",
      description: "Descripción del producto 3",
      date: "2024-06-03",
      image: "https://via.placeholder.com/75"
    },
    {
        title: "Post 4",
        description: "Descripción del producto 4",
        date: "2024-06-03",
        image: "https://via.placeholder.com/75"
      },{
        title: "Post 5",
        description: "Descripción del producto 5",
        date: "2024-06-03",
        image: "https://via.placeholder.com/75"
      }
  ];

  return (
    <>
    <div className="user-posts-main-container">
    <div className="user-posts-container">
      <h2 className="text-center mb-4">Productos Publicados</h2>
      <Row>
        {posts.map((post, index) => (
          <Col key={index} md={4}>
            <Card className="user-post-card">
              <Card.Img variant="top" src={post.image} className="user-post-card-img" />
              <Card.Body className="user-post-card-body">
                <Card.Title>{post.title}</Card.Title>
                <Card.Text className="item-card">{post.description}</Card.Text>
                <Card.Text className="item-card"><small className="text-muted">{post.date}</small></Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </div>
    </>
  );
};

export default UserPosts;
