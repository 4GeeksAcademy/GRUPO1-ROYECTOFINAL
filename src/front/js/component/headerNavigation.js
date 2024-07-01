import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta es correcta

const HeaderNavigation = () => {
  const { store } = useContext(Context);

  return (
    <Nav className="ml-auto header-navigation">
      <Nav.Link as={Link} to="/" className="nav-link-custom">Inicio</Nav.Link>
      <Nav.Link as={Link} to="/create-post" className="nav-link-custom">Publicar</Nav.Link>
      <Nav.Link as={Link} to="/profile" className="nav-link-custom">Tu perfil</Nav.Link>
      {store.token && store.user && (
        <div className="user-name">
          {store.user.nombre}
        </div>
      )}
    </Nav>
  );
};

export default HeaderNavigation;