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
    const handleIncrement = (thisProduct, functionality) => {
        const thisProductIndex = cartItems.indexOf(thisProduct)
        let updatedCart = [...cartItems];
        if (functionality === 'add') {

            updatedCart[thisProductIndex].quantità += 1;
        } else if (functionality === 'minus' && thisProduct.quantità > 1) {
            updatedCart[thisProductIndex].quantità -= 1;


        }
        setCartItems(updatedCart)

    }


    function calculateTotal(items) {
        let total = 0
        items.forEach(item => {
            const thisItemsPrice = item.price * item.quantità
            console.log(thisItemsPrice);

            total += thisItemsPrice;
        })
        return total

    }



    return (
        <div className='cartContainer'>
            {cartItems.length > 0 && (<div className='circle'>{cartItems.length}</div>)}
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
                                                    {item.quantità !== 1 && (<i
                                                        onClick={() => handleIncrement(item, 'minus')}
                                                        className={`fa-solid fa-minus cartIcon`}
                                                    ></i>)}

                                                    {item.quantità}
                                                    {item.quantità !== item.variations.stock && (<i
                                                        onClick={() => handleIncrement(item, 'add')}
                                                        className={`fa-solid fa-plus cartIcon`}
                                                    ></i>)}

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
