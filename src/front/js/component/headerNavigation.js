import React from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import '../../styles/headerNavigation.css'; // Asegúrate de crear este archivo y definir los estilos

const HeaderNavigation = () => {
  return (
    <Nav className="ml-auto header-navigation">
      <Nav.Link as={Link} to="/" className="nav-link-custom">Inicio</Nav.Link>
      <Nav.Link as={Link} to="/publica" className="nav-link-custom">Publicar</Nav.Link>
      <Nav.Link as={Link} to="/donaciones" className="nav-link-custom">Donaciones</Nav.Link>
      <NavDropdown title="Más" id="basic-nav-dropdown" className="nav-link-custom">
        <NavDropdown.Item href="#option1">Opción 1</NavDropdown.Item>
        <NavDropdown.Item href="#option2">Opción 2</NavDropdown.Item>
        <NavDropdown.Item href="#option3">Opción 3</NavDropdown.Item>
      </NavDropdown>
    </Nav>
  );
};

export default HeaderNavigation;
