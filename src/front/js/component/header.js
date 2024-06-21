import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHeart } from "react-icons/fa";
import HeaderNavigation from "./headerNavigation";
import "../../styles/header.css";
import { Context } from "../store/appContext";

export const Header = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        if (store.token) {
            actions.getFavorites();
        }
    }, [store.token]);

    const handleLogout = () => {
        actions.logout();
    };

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
                                <Link to="/profile" className="mr-3">
                                    <FaUser className="header-user-icon" size={24} />
                                </Link>
                                <div className="header-favorites-icon-container mr-3">
                                    <Link className="header-favorites-icon" to="/favorites">
                                        <FaHeart size={24} />
                                        <span className="badge">{store.favorites.length}</span>
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
        </>
    );
};
