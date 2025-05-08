import React, { useState } from 'react';
import './navbar.css'; // Modificato per utilizzare il file CSS normale
import SearchBar from '../SearchBar/SearchBar';
import Cart from '../Cart/Cart';
import { Link, useNavigate } from 'react-router-dom'; // Aggiungi useNavigate
import { useGlobal } from '../../contexts/GlobalContext';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const {
        fetchIndexMacroArea,
        accessories,
        setAccessories,
        bottom,
        setBottom,
        top,
        setTop,
        visualizedProducts,
        setVisualizedProducts
    } = useGlobal();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleCategoryClick = (macroArea, setMacroArea, title) => {
        // Aggiorna i dati
        if (macroArea.length > 0) {
            setVisualizedProducts(macroArea);
        } else {
            fetchIndexMacroArea(title, (data) => {
                setMacroArea(data);
                setVisualizedProducts(data);
            });
        }
        // Naviga alla pagina prodotti con il parametro
        navigate(`/products?macro_area=${title}`);
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
                    <li className="navlink">
                        <span onClick={() => handleCategoryClick(top, setTop, 'upper-body')}>
                            Upper Body
                        </span>
                    </li>
                    <li className="navlink">
                        <span onClick={() => handleCategoryClick(bottom, setBottom, 'lower-body')}>
                            Lower Body
                        </span>
                    </li>
                    <li className="navlink">
                        <span onClick={() => handleCategoryClick(accessories, setAccessories, 'accessori')}>
                            Accessories
                        </span>
                    </li>
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
