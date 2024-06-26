import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHeart, FaEnvelope } from "react-icons/fa";
import HeaderNavigation from "./headerNavigation";
import "../../styles/header.css";
import { Context } from "../store/appContext";
import RequestsModal from "../component/requestModal"; // Asegúrate de importar el modal de requests
import { Tooltip } from "react-tooltip"; // Importar Tooltip

export const Header = () => {
    const { store, actions } = useContext(Context);
    const [showRequestsModal, setShowRequestsModal] = useState(false);

    useEffect(() => {
        if (store.token) {
            actions.getFavorites();
            actions.getRequests(); // Obtener las solicitudes de contacto
        }
    }, [store.token]);

    const handleLogout = () => {
        actions.logout();
    };

    const handleRequestsShow = () => setShowRequestsModal(true);
    const handleRequestsClose = () => setShowRequestsModal(false);

    return (
        <>
            <nav className="navbar navbar-light bg-white navbar-container-custom">
                <div className="container d-flex justify-content-between align-items-center">
                    <Link to="/" className="logo-tag">
                        <h1 className="logo">SECOND</h1>
                        <h1 className="logo1">CHANCES</h1>
                    </Link>
                    <span className="header-slogan" style={{ color: "#D95383", fontWeight: "bold" }}>
                        Donate, Exchange, and Sell for a Cause
                    </span>
                    <div className="d-flex align-items-center header-functions-container">
                        {store.token ? (
                            <>
                                <Link to="/profile" className="mr-3" data-tooltip-id="profileTooltip" data-tooltip-content="Tú Perfil">
                                    <FaUser className="header-user-icon" size={24} />
                                </Link>
                                <Tooltip id="profileTooltip" place="bottom" effect="solid" className="custom-tooltip" />
                                <div className="header-requests-icon-container mr-3 position-relative" data-tooltip-id="requestsTooltip" data-tooltip-content="Solicitudes">
                                    <FaEnvelope className="message-button" size={24} onClick={handleRequestsShow} />
                                    <span className="notification-badge-header">{store.requests.length}</span>
                                </div>
                                <Tooltip id="requestsTooltip" place="bottom" effect="solid" className="custom-tooltip" />
                                <div className="header-favorites-icon-container mr-3">
                                    <Link className="header-favorites-icon" to="/favorites">
                                        <div className="position-relative">
                                            <FaHeart size={24} />
                                            <span className="badge">{store.favorites.length}</span>
                                        </div>  
                                    </Link>
                                    <div className="dropdown-content">
                                        {store.favorites.length > 0 ? (
                                            store.favorites.map((favorite) => (
                                                <Link 
                                                    key={favorite.id} 
                                                    to={`/post/${favorite.post.id}`} 
                                                    className="dropdown-item"
                                                >
                                                    <strong>{favorite.post.title}</strong>
                                                    <p>{favorite.post.subtitle}</p>
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="dropdown-item">Aún no hay favoritos</p>
                                        )}
                                    </div>
                                </div>
                                <button className="btn login-button header-login-button" onClick={handleLogout}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="btn login-button header-login-button">Login</button>
                                </Link>
                                <Link to="/register">
                                    <button className="btn login-button header-login-button">Register</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <HeaderNavigation />
            <RequestsModal show={showRequestsModal} handleClose={handleRequestsClose} />
        </>
    );
};
