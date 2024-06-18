import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaHeart } from "react-icons/fa";
import HeaderNavigation from "./headerNavigation";
import "../../styles/header.css";

export const Header = () => {
  return (
    <>
    <nav className="navbar navbar-light bg-white navbar-container-custom">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="logo-tag" >
          <h1 className="logo">SECOND</h1>
          <h1 className="logo1">CHANCES</h1>
        </Link>
        <span className="header-slogan" style={{ color: "#DEAD6F", fontWeight: "bold" }}>
          Donate, Exchange, and Sell for a Cause
        </span>
        <div className="d-flex align-items-center header-functions-container">
          <Link to="/profile" className="mr-3">
            <FaUser className="header-user-icon" size={24} />
          </Link>
          <div className="header-favorites-icon-container mr-3">
            <Link className="header-favorites-icon" to="/favorites">
              <FaHeart size={24} />
              <span className="badge">3</span>
            </Link>
            <div className="dropdown-content">
              <div className="dropdown-item">
                <strong>Product 1</strong>
                <p>Subtitle 1</p>
              </div>
              <div className="dropdown-item">
                <strong>Product 2</strong>
                <p>Subtitle 2</p>
              </div>
              <div className="dropdown-item">
                <strong>Product 3</strong>
                <p>Subtitle 3</p>
              </div>
            </div>
          </div>
          <Link to="/login">
            <button 
              className="btn login-button header-login-button"
            >
              Login
            </button>
          </Link>
        </div>
      </div>
    </nav>
    <HeaderNavigation/>
    </>
  );
};
