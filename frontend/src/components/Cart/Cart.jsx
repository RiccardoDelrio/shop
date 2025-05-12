import React, { useState } from 'react'
import './cart.css'
import { Link } from 'react-router'
import { useGlobal } from '../../contexts/GlobalContext'

const Cart = () => {
    const { products, cartItems, setCartItems, groupedProducts, bottom, randomProducts } = useGlobal()
    console.log(products);

    const [isOpen, setIsOpen] = useState(false)


    const toggleCart = () => {
        setIsOpen(!isOpen)
    }
    const handleRemoveItems = (index) => {

        setCartItems(cartItems.filter((item, idx) => idx !== index))
    }


    function calculateTotal(items) {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
    }

    return (
        <div className='cartContainer'>
            {cartItems.length > 0 && (<div className='circle'></div>)}
            <div className='cart' onClick={toggleCart}>
                <i className='fa-solid fa-cart-shopping'></i>
            </div>

            {isOpen && (
                <div className='cartPopup'>
                    <div className='cartHeader'>
                        <h3>Il tuo carrello</h3>
                        <button onClick={toggleCart}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div className={`cartContent ${cartItems.length > 0 ? '' : 'align-items-center'}`}>
                        {cartItems.length > 0 ? (
                            <div className='cartItems'>
                                {cartItems.map((item, index) => (
                                    <div key={index} className='cartItem'>
                                        <div>
                                            <img className='itemImage' src={`http://localhost:3000/imgs/${item.images[0].url}`} alt={item.name} />
                                        </div>
                                        <div className='cartItemContent'>
                                            <div>{item.name}</div>
                                            <div className='cartInfo'>
                                                <div>{item.price} €</div>
                                                <div className='d-flex align-items-center gap-2 h6'>
                                                    <i
                                                        /* onClick={() => handleQuantity(item.id, 'remove')} */
                                                        className={`fa-solid fa-minus cartIcon`}
                                                    ></i>
                                                    {/* {item.quantity} */} 1
                                                    <i
                                                        /* onClick={() => handleQuantity(item.id, 'add')} */
                                                        className={`fa-solid fa-plus cartIcon`}
                                                    ></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div onClick={() => handleRemoveItems(index)} ><i className='fa-solid fa-xmark'></i></div>

                                    </div>
                                ))}
                                <div className='total'>
                                    Totale : <span>{calculateTotal(cartItems)}€</span>
                                </div>
                            </div>
                        ) : (
                            <p className='emptyCart'>Il carrello è vuoto</p>
                        )}
                    </div>

                    <div className='cartFooter'>
                        <Link to="/carello">Vai al carrello <span><i className='fa-solid fa-arrow-right'></i></span></Link>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart
