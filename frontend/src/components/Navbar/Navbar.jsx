import React, { useState } from 'react';
import './navbar.css'; // Modificato per utilizzare il file CSS normale
import SearchBar from '../SearchBar/SearchBar';
import Cart from '../Cart/Cart';
import { Link } from 'react-router';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="navbar">
            {/* Right nav */}
            <div className="rightnav">
                <div className="logo">
                    <img src="/img/logo.svg" alt="" />
                    <h1 className="header_title">Boolean</h1>
                </div>

                <ul className={`ul ${isMenuOpen ? 'menuOpen' : ''}`}>
                    <li className="navlink"><Link to={'/'}>Home</Link></li>
                    <li className="navlink"><Link to={'/'}>Upper Body</Link></li>
                    <li className="navlink"><Link to={'/'}>Lower Body</Link></li>
                    <li className="navlink"><Link to={'/'}>Accessories</Link></li>
                    <li className="navlink"><Link to={'/catalogo'}>Catalog</Link></li>

                </ul>
            </div>
            {/* Left nav */}
            <div className="leftnav">
                <SearchBar />
                <Cart />
                <div className="hamburgerMenu" onClick={toggleMenu}>
                    <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
