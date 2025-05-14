import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Import to ensure fonts are available
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="main-container not-found-container">
            <div className="not-found-logo">
                <div className="logo-circle">
                    <img
                        src="/img/logo.svg"
                        alt="Boolique Logo"
                        className="logo-image"
                    />
                </div>

                <h1 className="brand-title">Boolique</h1>
            </div>

            <div className="not-found-content">
                <h2 className="error-code">404</h2>
                <h3 className="error-title">Page Not Found</h3>
                <p className="error-message">The page you are looking for does not exist or has been moved.</p>
            </div>

            <div className="action-buttons">
                <Link to="/" className="home-button">
                    Return to Homepage
                </Link>

                <Link to="/catalogo" className="browse-button">
                    Browse Products
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
