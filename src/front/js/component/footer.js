import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/footer.css';

const Footer = () => {
	return (
		<footer className="footer-main-container">
			<div className="footer-container">
				<div className="">
					<Link to="/publica" className="logo-tag">
						<h1 className="footer-logo">SECOND</h1>
						<h1 className="footer-logo1">CHANCES</h1>
					</Link>
				</div>
				<div className="icons-container">
					<a href="https://github.com" target="_blank" rel="noopener noreferrer">
						<FaGithub className="icons" size={24} />
					</a>
					<a className="icons" href="https://4geeksacademy.com" target="_blank" rel="noopener noreferrer">
						<img src="https://res.cloudinary.com/djpifu0cl/image/upload/v1718593153/4GeeksAcademyLogo-500x474_oplmwf.jpg" alt="4GeeksAcademy Logo" className="footer-image" />
					</a>
					<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
						<FaLinkedin className="icons" size={24} />
					</a>
				</div>
				<div>
					<Link to="/about-us">
						<button className="footer-button">Sobre nosotros</button>
					</Link>
				</div>
			</div>

		</footer>
	);
};

export default Footer;
