import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./ProductDetail.css";
import { useGlobal } from "../contexts/GlobalContext";

const ProductDetails = () => {
    const { slug } = useParams();
    const { cartItems, setCartItems, wishlistItems, toggleWishlist } = useGlobal()
    const [product, setProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [addToCart, setAddToCart] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false);
    console.log('cart items', cartItems);


    const thisProductInCart = cartItems.find(item =>
        item?.id === product?.id && item?.variations?.id === selectedVariation?.id
    );


    const handleAddCart = (thisProduct) => {
        const variationIndex = thisProduct.variations.indexOf(selectedVariation)
        const rightVariation = thisProduct.variations[variationIndex]
        const discountedPrice = () => {
            const discount = Number(thisProduct.discount)
            const price = Number(thisProduct.price)
            let discountedPrice;
            if (discount > 0) {
                const newPrice = price - price * discount / 100
                return newPrice

            } else {

                return price
            }
        }


        const existingProduct = cartItems.find(item =>
            item.id === thisProduct.id && item.variations.id === rightVariation.id
        );
        const existingProductIndex = cartItems.indexOf(existingProduct)
        let updatedCart;
        if (existingProduct) {
            updatedCart = [...cartItems]
            updatedCart[existingProductIndex].quantità += 1;
            updatedCart[existingProductIndex].price = discountedPrice()

        } else {
            updatedCart = [...cartItems, { ...thisProduct, quantità: 1, variations: rightVariation, price: discountedPrice() }]
        }
        setCartItems(updatedCart)
        setAddToCart(false); // resetta subito
        setTimeout(() => {
            setAddToCart(true); // ora cambia, quindi lo useEffect si attiva
        }, 0);

    }

    console.log(addToCart);

    const handleRemoveItems = (index) => {
        setCartItems(cartItems.filter((item, idx) => idx !== index));
    };
    console.log(cartItems.indexOf(thisProductInCart), 'index');




    useEffect(() => {
        fetch(`http://localhost:3000/api/v1/products/${slug}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                // Imposta l'immagine corrente con il primo URL dell'array
                if (data.images && data.images.length > 0) {
                    setCurrentImage(`http://localhost:3000/imgs/${data.images[0].url}`);
                }
            })
            .catch((err) => console.error("Error:", err));
    }, [slug]);
    console.log(product);

    // Raggruppa le variazioni per colore
    const getUniqueColors = (variations) => {
        const uniqueColors = [];
        variations.forEach(variant => {
            if (!uniqueColors.find(c => c.color === variant.color)) {
                uniqueColors.push({
                    color: variant.color,
                    color_hex: variant.color_hex
                });
            }
        });
        return uniqueColors;
    };

    // Filtra le variazioni per il colore selezionato
    const getVariationsForColor = (variations, color) => {
        return variations.filter(variant => variant.color === color);
    };
    useEffect(() => {
        if (addToCart) {
            setTimeout(() => {
                setAddToCart(false)

            }, 2000);
        }
    }, [addToCart])

    const alredyInCart = () => {
        if (!selectedVariation || !product?.variations) return false;

        const variationIndex = product.variations.indexOf(selectedVariation);
        if (variationIndex === -1) return false;

        const rightVariation = product.variations[variationIndex];
        if (!rightVariation) return false;

        const existingProduct = cartItems.find(item =>
            item?.id === product?.id && item?.variations?.id === rightVariation.id
        );

        return !!existingProduct;
    };

    const handleIncrement = (functionality) => {
        const cartProductIndex = cartItems.findIndex(item =>
            item.id === product.id && item.variations.id === selectedVariation.id
        );

        if (cartProductIndex === -1) return;

        let updatedCart = [...cartItems];
        if (functionality === 'add') {
            updatedCart[cartProductIndex].quantità += 1;
        } else if (functionality === 'minus' && updatedCart[cartProductIndex].quantità > 1) {
            updatedCart[cartProductIndex].quantità -= 1;
        }

        setCartItems(updatedCart);
    };
    const isButtonDisabled = thisProductInCart?.quantità >= selectedVariation?.stock


    const formatPrice = (price) => {
        const num = Number(price);
        return num % 1 === 0 ? num.toString() : num.toFixed(2);
    };


    if (!product) return <div>Loading...</div>;

    const availableColors = getUniqueColors(product.variations);

    const isInWishlist = wishlistItems.some(item => item.id === product?.id);

    const handleWishlistClick = () => {
        if (isInWishlist) {
            // If item is already in wishlist, allow removal without checks
            toggleWishlist(product);
        } else {
            // Only check for color and size when adding to wishlist
            if (!selectedColor || !selectedVariation) {
                handleDisabledClick();
                return;
            }
            const wishlistProduct = {
                ...product,
                selectedColor,
                selectedVariation,
                selectedImage: currentImage
            };
            toggleWishlist(wishlistProduct);
        }
    };

    const handleDisabledClick = () => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    return (
        <section className="product position-relative">
            {addToCart && (
                <div className="position-absolute end-0 bottom-0 bg-success p-3 rounded-4">Aggiunto al carrello <span className="ms-2"><i className="fa-solid fa-check"></i></span></div>
            )}

            <div className="product__photo">
                <div className="photo-container">
                    <div className="photo-main">
                        <div className="controls">
                            <div style={{ position: 'relative' }}>
                                <button
                                    className={`btn wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
                                    onClick={handleWishlistClick}
                                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                                >
                                    <i className={`bi bi-heart${isInWishlist ? '-fill' : ''}`}></i>
                                </button>
                                {showTooltip && (
                                    <div className="wishlist-tooltip">
                                        {!selectedColor
                                            ? 'Please select a color first'
                                            : !selectedVariation
                                                ? 'Please select a size first'
                                                : ''}
                                    </div>
                                )}
                            </div>
                        </div>
                        <img
                            className="img_main"
                            src={currentImage}
                            alt={product.name}
                        />
                    </div>
                    <div className="photo-album">
                        <ul>
                            {product.images.map((image, index) => (
                                <li key={index} onClick={() => setCurrentImage(`http://localhost:3000/imgs/${image.url}`)}>
                                    <img
                                        src={`http://localhost:3000/imgs/${image.url}`}
                                        alt={`${product.name} view ${index + 1}`}
                                        className={currentImage === `http://localhost:3000/imgs/${image.url}` ? 'active' : ''}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="product__info">
                <div className="title">
                    <h1>{product.name}</h1>
                </div>
                {/* // Replace the current price display with this */}
                <div className="price d-flex align-items-center">
                    {product.discount > 0 ? (
                        <>
                            <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '10px' }}>
                                € {formatPrice(product.price)}
                            </span>
                            <span style={{ color: '#c00' }}>
                                € {formatPrice(product.price - (product.price * Number(product.discount) / 100))}
                            </span>
                            <span style={{ fontSize: '0.85rem', marginLeft: '8px', backgroundColor: '#c00', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>
                                &minus; {formatPrice(product.discount)} %
                            </span>
                        </>
                    ) : (
                        <>€ <span className="ms-2">{formatPrice(product.price)}</span></>
                    )}
                </div>
                <div className="variant">
                    <h3>SELECT A COLOR</h3>
                    <ul className="color-list">
                        {availableColors.map((colorOption) => (
                            <li
                                key={colorOption.color}
                                className={selectedColor === colorOption.color ? 'active' : ''}
                                onClick={() => {
                                    setSelectedColor(colorOption.color);
                                    setSelectedVariation(null);
                                }}
                            >
                                <div
                                    className="color-preview"
                                    style={{ backgroundColor: colorOption.color_hex }}
                                />
                                <span>{colorOption.color}</span>
                            </li>
                        ))}
                    </ul>

                    {selectedColor && (
                        <>
                            <h3>SELECT A SIZE</h3>
                            <ul className="size-list">
                                {getVariationsForColor(product.variations, selectedColor).map((variation) => (
                                    <div key={variation.id}>
                                        <li

                                            className={selectedVariation?.id === variation.id ? 'active' : ''}
                                            onClick={() => setSelectedVariation(variation)}
                                        >
                                            {variation.size}
                                        </li>
                                        {selectedVariation === variation && (

                                            <div className="small text-secondary">{variation.stock > 0 ? `${variation.stock} left` : 'Out of stock'}  </div>
                                        )}

                                    </div>
                                ))}
                            </ul>
                            <Link to={'/size-table'} className="m-0 text-secondary  small">Size guide </Link>
                        </>
                    )}
                </div>
                <div className="description">
                    <h3>DESCRIPTION</h3>
                    <p>{product.description}</p>
                    <p>{product.long_description}</p>

                </div>
                {alredyInCart() ? (
                    <div className="quantity-selector">
                        {thisProductInCart?.quantità === 1 ? (
                            <button onClick={() => handleRemoveItems(cartItems.indexOf(thisProductInCart))} className="icon-quantity">
                                <i className="fa-solid fa-trash"></i>

                            </button>

                        ) : (
                            <button onClick={() => handleIncrement('minus')} className="icon-quantity">
                                <i className="fa-solid fa-minus"></i>
                            </button>)}

                        <div>{thisProductInCart?.quantità}</div>
                        <button disabled={isButtonDisabled} onClick={() => handleIncrement('add')} className={`icon-quantity ${isButtonDisabled ? 'disabled' : ''}`}>
                            <i className="fa-solid fa-plus"> </i>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => handleAddCart(product)}
                        className="buy--btn"
                        disabled={!selectedVariation || selectedVariation.stock === 0}
                    >
                        {!selectedColor ? 'SELECT A COLOR' :
                            !selectedVariation ? 'SELECT A SIZE' :
                                selectedVariation.stock === 0 ? 'OUT OF STOCK' :
                                    'ADD TO CART'}
                    </button>
                )}

            </div>
        </section >
    );
};

export default ProductDetails;