import React, { useState, useEffect } from 'react';
import './navbar.css';
import SearchBar from '../SearchBar/SearchBar';
import Cart from '../Cart/Cart';
import { Link } from 'react-router-dom';
import { useGlobal } from '../../contexts/GlobalContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { wardrobeSections, fetchWardrobeSections } = useGlobal();

    useEffect(() => {
        fetchWardrobeSections();
    }, []);

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
                    <li className="navlink"><Link to="/">Home</Link></li>
                    {wardrobeSections.map(section => (
                        <li key={section.id} className="navlink">
                            <Link to={`/wardrobe-section/${section.slug}`}>{section.name}</Link>
                        </li>
                    ))}
                    <li className="navlink"><Link to="/catalogo">Catalog</Link></li>
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
