import React from 'react'
import styles from './navbar.module.css'
import SearchBar from '../SearchBar/SearchBar'
import Cart from '../Cart/Cart'

const Navbar = () => {
    return (
        <div className={styles.navbar}>

            {/* Right nav */}
            <div className={styles.rightnav}>
                <div className={styles.logo}>
                    Logo
                </div>
                <ul className={styles.ul}>
                    {['Home', 'Prodotti', 'Contatti'].map(navlink => (
                        <li key={navlink} className={styles.navlink}>{navlink}</li>
                    ))}
                </ul>

            </div>
            {/* Left nav */}
            <div className={styles.leftnav}>
                <SearchBar />
                <Cart />

            </div>


        </div>
    )
}

export default Navbar
