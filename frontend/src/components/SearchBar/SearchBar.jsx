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
                <input className="form-control ps-3 rounded-pill" type="search" placeholder="Cerca..." aria-label="Search" />
            )}


        </div>
    )
}

export default SearchBar
