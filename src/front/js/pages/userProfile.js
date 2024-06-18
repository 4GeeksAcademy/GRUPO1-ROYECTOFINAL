import React from 'react';
import { Card, Image, Row, Col, Button } from 'react-bootstrap';
import { FaPencilAlt, FaEnvelope } from 'react-icons/fa';
import '../../styles/userProfile.css';
import UserPosts from '../component/userPosts';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const userDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sit amet accumsan tortor. Nulla facilisi. Nullam ultricies, justo at convallis mollis, nunc ex feugiat odio, et accumsan ipsum nulla ut quam. Phasellus interdum, justo eget aliquet maximus, turpis nulla sollicitudin felis, ut vehicula justo quam ut urna.";

  return (
    <>
      <div className="user-profile-background">
        <Card className="user-profile-card">
          <div className="user-image-container">
            <Image src="https://res.cloudinary.com/djpifu0cl/image/upload/v1718598453/4geeks_cm8jnn.webp" roundedCircle className="user-image" />
          </div>
          <div className="button-container-create">
            <Link to="/create-post">
              <Button className="add-button">Agregar Donación</Button>
            </Link>
            <Button className="edit-button" variant="light"><FaPencilAlt /></Button>
          </div>
          <div className="message-button-container">
            <Button className="message-button" variant="light"><FaEnvelope /></Button>
            <span className="notification-badge">1</span>
          </div>
          <Card.Body className="user-profile-body">
            <Card.Title className="text-center">Majadi Rackshi</Card.Title>
            <Card.Subtitle className="mb-2 text-center text-muted">Denver, Colorado</Card.Subtitle>
            <Row className="text-center user-stats">
              <Col className="user-stat">
                <div className="user-stat-number">3</div>
                DONACIONES
              </Col>
              <Col className="user-stat">
                <div className="user-stat-number">4</div>
                VENTAS
              </Col>
              <Col className="user-stat">
                <div className="user-stat-number">0</div>
                INTERCAMBIO
              </Col>
            </Row>
            <Card.Text className="text-center card-text">
              {userDescription.substring(0, 200)}...
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <UserPosts />
    </>
  );
};

export default UserProfile;
