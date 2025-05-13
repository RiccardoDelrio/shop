import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // Import to ensure fonts are available

const NotFound = () => {
    return (
        <div className="main-container not-found-container text-center py-4" style={{
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            color: 'white'
        }}>
            <div className="logo mb-3" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    padding: '15px',
                    boxShadow: '0 0 20px rgba(128, 0, 0, 0.3)'
                }}>
                    <img
                        src="/img/logo.svg"
                        alt="Boolique Logo"
                        style={{
                            width: '100px',
                            height: '100px',
                            filter: 'drop-shadow(0 0 8px rgba(128, 0, 0, 0.5))'
                        }}
                    />
                </div>

                <h1 className="header_title mt-3" style={{
                    fontFamily: '"Delius Swash Caps", cursive',
                    fontSize: '3rem',
                    position: 'relative',
                    color: 'white',
                    letterSpacing: '1px',
                }}>Boolique</h1>
            </div>

            <div style={{
                marginBottom: '2rem',
                position: 'relative'
            }}>
                <h2 style={{
                    fontSize: '8rem',
                    fontWeight: 'bold',
                    margin: '0',
                    backgroundImage: 'linear-gradient(135deg, #fff 20%, #ffcccc 80%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '0.5rem',
                    textShadow: '0 5px 15px rgba(0,0,0,0.3)',
                    lineHeight: '1'
                }}>404</h2>

                <h3 className="mb-3" style={{
                    fontSize: '1.8rem',
                    fontWeight: '300',
                    letterSpacing: '0.2rem',
                    marginTop: '0.5rem'
                }}>Page Not Found</h3>

                <p className="mb-4" style={{
                    fontSize: '1rem',
                    maxWidth: '500px',
                    margin: '0 auto',
                    opacity: '0.8'
                }}>The page you are looking for does not exist or has been moved.</p>
            </div>

            <div className="d-flex justify-content-center gap-4">
                <Link
                    to="/"
                    className="btn px-4 py-3"
                    style={{
                        borderColor: '#800000',
                        color: 'white',
                        backgroundColor: 'transparent',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.4s ease',
                        fontSize: '1.1rem',
                        borderRadius: '4px',
                        paddingLeft: '2rem',
                        paddingRight: '2rem',
                        minWidth: '200px',
                        fontWeight: '500',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#800000';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#800000';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#800000';
                    }}
                >
                    Return to Homepage
                </Link>

                <Link
                    to="/search"
                    className="btn px-4 py-3"
                    style={{
                        borderColor: 'white',
                        color: '#800000',
                        backgroundColor: 'white',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.4s ease',
                        fontSize: '1.1rem',
                        borderRadius: '4px',
                        paddingLeft: '2rem',
                        paddingRight: '2rem',
                        minWidth: '200px',
                        fontWeight: '500',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        letterSpacing: '0.5px'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = 'white';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.color = '#800000';
                        e.currentTarget.style.borderColor = 'white';
                    }}
                >
                    Browse Products
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
