import React from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { Link } from "react-router-dom";
import "./PageCarello.css";

const Carrello = () => {
    const { cartItems, setCartItems } = useGlobal();

    const subtotal = calculateSubTotal(cartItems);
    // Correctly extract the 22% IVA from price that already includes it
    const ivaAmount = Number((subtotal - (subtotal / 1.22)).toFixed(2));
    const shipPrice = subtotal >= 500 ? 0 : 30;

    // Format a number to display as currency (with comma as decimal separator)
    const formatCurrency = (value) => {
        return value.toFixed(2).replace('.', ',');
    };

    const handleRemoveItems = (index) => {
        setCartItems(cartItems.filter((item, idx) => idx !== index));
    };

    function calculateSubTotal(items) {
        let total = 0;
        items.forEach(item => {
            const thisItemsPrice = item.price * item.quantità;
            total += thisItemsPrice;
        });
        return total;
    }

    function calculateTotal() {
        return calculateSubTotal(cartItems) + shipPrice;
    }

    const handleIncrement = (thisProduct, functionality) => {
        const thisProductIndex = cartItems.indexOf(thisProduct);
        let updatedCart = [...cartItems];
        if (functionality === 'add') {
            updatedCart[thisProductIndex].quantità += 1;
        } else if (functionality === 'minus' && thisProduct.quantità > 1) {
            updatedCart[thisProductIndex].quantità -= 1;
        }
        setCartItems(updatedCart);
    };    const calculateOriginalPrice = (item, discountedPrice, discountPercentage) => {
        if (Number(item.discount) > 0) {
            const discountFactor = 1 - discountPercentage / 100;
            const originalPrice = discountedPrice / discountFactor;
            return formatCurrency(originalPrice);
        }
        return null;
    };

    console.log('Cart Items', cartItems);    return (
        <div className="cart-container">
            <div className="cart-header">
                <h2 className="cart-title">Your Cart</h2>
                <hr className="cart-divider" />
            </div>
            
            {cartItems.length === 0 ? (
                <div className="empty-cart-message">
                    <h4>Your cart is empty</h4>
                    <p>Add products to your cart to continue shopping.</p>
                    <Link to="/catalogo" className="btn continue-shopping-btn mt-3">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="row">
                    {/* Product Column */}
                    <div className="col-lg-8">
                        {cartItems.map((item, index) => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={`http://localhost:3000/imgs/${item.images[0].url}`} alt={item.name} width="80" height="80" />
                                </div>
                                <div className="cart-item-details">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">
                                        {item.discount > 0 && (
                                            <span className="cart-item-discount">
                                                {calculateOriginalPrice(item, Number(item.price), Number(item.discount))} €
                                            </span>
                                        )}
                                        {formatCurrency(item.price)} €
                                    </div>
                                    <div className="cart-item-quantity">Quantity: {item.quantità}</div>
                                    <div className="cart-item-subtotal">Subtotal: {formatCurrency(item.price * item.quantità)} €</div>
                                </div>
                                <div className="cart-item-actions">
                                    <button onClick={() => handleRemoveItems(index)} className="cart-remove-btn">
                                        <i className="bi bi-x-lg"></i> Remove
                                    </button>
                                    <div>
                                        <button 
                                            disabled={item.quantità === 1} 
                                            onClick={() => handleIncrement(item, 'minus')} 
                                            className="cart-quantity-btn"
                                        >
                                            <i className="bi bi-dash-lg"></i>
                                        </button>
                                        <span className="mx-2">{item.quantità}</span>
                                        <button 
                                            disabled={item.variations.stock === item.quantità} 
                                            onClick={() => handleIncrement(item, 'add')} 
                                            className="cart-quantity-btn"
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Column */}
                    <div className="col-lg-4">
                        <div className="cart-summary">
                            <h4 className="cart-summary-title">Order Summary</h4>
                            <div className="cart-summary-row">
                                <span>Subtotal:</span>
                                <span>{formatCurrency(subtotal)} €</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>VAT (22%):</span>
                                <span>{formatCurrency(ivaAmount)} €</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Shipping:</span>
                                <span>{formatCurrency(shipPrice)} €</span>
                            </div>
                            
                            {shipPrice === 0 ? (
                                <div className="free-shipping-note">
                                    <i className="bi bi-check-circle-fill me-1"></i> Free shipping applied!
                                </div>
                            ) : (
                                <div className="shipping-info">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Spend {formatCurrency(500 - subtotal)} € more to get free shipping.
                                </div>
                            )}
                            
                            <hr className="cart-summary-divider" />
                            
                            <div className="cart-summary-total">
                                <span>Total:</span>
                                <span>{formatCurrency(calculateTotal())} €</span>
                            </div>
                            
                            <Link 
                                to="/checkout" 
                                className="checkout-btn" 
                                aria-disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Carrello;
