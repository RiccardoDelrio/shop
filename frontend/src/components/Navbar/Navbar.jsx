import React, { useState } from 'react'
import styles from './navbar.module.css'
import SearchBar from '../SearchBar/SearchBar'
import Cart from '../Cart/Cart'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (

        <div className={styles.navbar}>
            {/* Right nav */}
            <div className={styles.rightnav}>
                <div className={styles.logo}>
                    <img src="./img/logo.svg" alt="" />
                    <h1>Boolean</h1>
                </div>

                <ul className={`${styles.ul} ${isMenuOpen ? styles.menuOpen : ''}`}>
                    {['Home', 'Trench', 'Pantaloni', 'Scarpe', 'Catalogo', 'Contatti'].map(navlink => (
                        <li key={navlink} className={styles.navlink}>{navlink}</li>
                    ))}
                </ul>

            </div>
            {/* Left nav */}
            <div className={styles.leftnav}>
                <SearchBar />
                <Cart />
                <div className={styles.hamburgerMenu} onClick={toggleMenu}>
                    <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                </div>
            </div>
        </div>
    )
}

export default Navbar
