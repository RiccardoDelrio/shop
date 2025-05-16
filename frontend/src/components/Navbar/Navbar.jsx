import React, { useState, useEffect } from 'react';
import './navbar.css';
import SearchBar from '../SearchBar/SearchBar';
import Cart from '../Cart/Cart';
import UserMenu from '../UserMenu/UserMenu';
import { Link } from 'react-router-dom';
import { useGlobal } from '../../contexts/GlobalContext';
import { useAuth } from '../../contexts/AuthContext';


const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { wardrobeSections, fetchWardrobeSections } = useGlobal();
    const { currentUser } = useAuth();

    useEffect(() => {
        fetchWardrobeSections();
    }, []);
    useEffect(() => {
        if (isMenuOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        // Clean up quando il componente si smonta
        return () => document.body.classList.remove('no-scroll');
    }, [isMenuOpen]);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="navbar ">
            {/* Top row - Logo, search and user controls */}
            <div className="navbar-top-row">
                {/* Logo on the left */}
                <div className="navbar-left">
                    <Link to="/">
                        <div className="logo">
                            <img src="/img/logo.svg" alt="Boolique Logo" />
                            <h1 className="header_title">Boolique</h1>
                        </div>
                    </Link>
                </div>

                {/* Search and user controls on the right */}
                <div className="navbar-right">
                    <SearchBar />
                    <UserMenu />
                    <Cart />
                    <div className="hamburgerMenu" onClick={toggleMenu}>
                        <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                    </div>
                </div>
            </div>

            {/* Bottom row with centered navigation links */}
            <div className="navbar-bottom-row">
                <ul className={`nav-links ${isMenuOpen ? 'menuOpen' : ''}`}>
                    <li className="navlink"><Link to="/">Home</Link></li>
                    {wardrobeSections.map(section => (
                        <li key={section.id} className="navlink">
                            <Link to={`/wardrobe-section/${section.slug}`}>{section.name}</Link>
                        </li>
                    ))}
                    <li className="navlink"><Link to="/catalogo">Catalog</Link></li>
                    {/* Aggiunto il link della wishlist come elemento della navbar */}
                    <li className="navlink">
                        <Link to="/wishlist" className="d-flex align-items-center">
                            <i className="bi bi-heart"></i>
                            <span className="ms-2">Wishlist</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
