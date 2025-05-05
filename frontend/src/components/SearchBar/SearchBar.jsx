import React, { useState } from 'react'
import styles from './searchbar.module.css'

const SearchBar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const handleOpen = () => setIsOpen(true)
    return (
        <div className={styles.search} onClick={handleOpen}>
            {!isOpen ? (
                <i className='fa-solid fa-magnifying-glass'></i>
            ) : (
                <input className={styles.searchOpen} type="search" name="search" id="search" placeholder='Cerca...' />
            )}


        </div>
    )
}

export default SearchBar
