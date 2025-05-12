import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { useGlobal } from "../contexts/GlobalContext";

const ProductDetails = () => {
    const { slug } = useParams();
    const { cartItems, setCartItems } = useGlobal()
    const [product, setProduct] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [selectedVariation, setSelectedVariation] = useState(null);

    const handleAddCart = (thisProduct) => {
        const existingProduct = cartItems.find(item => item.id === thisProduct.id)
        const existingProductIndex = cartItems.indexOf(existingProduct)
        let updatedCart;
        if (existingProduct) {
            updatedCart = [...cartItems]
            updatedCart[existingProductIndex].quantità += 1;

        } else {
            updatedCart = [...cartItems, { ...thisProduct, quantità: 1 }]
        }
        setCartItems(updatedCart)
    }
    console.log(cartItems, "ciao");




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

    if (!product) return <div>Loading...</div>;

    return (
        <section className="product">
            <div className="product__photo">
                <div className="photo-container">
                    <div className="photo-main">
                        <div className="controls">
                            <button className="btn ">
                                <i className="bi bi-heart"></i>
                            </button>
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
                <div className="price">
                    € <span>{Number(product.price).toFixed(2)}</span>
                </div>
                <div className="variant">
                    <h3>SELECT A SIZE</h3>
                    <ul className="size-list">
                        {product.variations.map((variation) => (
                            <li
                                key={variation.id}
                                className={selectedVariation?.id === variation.id ? 'active' : ''}
                                onClick={() => setSelectedVariation(variation)}
                            >
                                {variation.size}
                                <small>({variation.stock} left)</small>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="description">
                    <h3>DESCRIPTION</h3>
                    <p>{product.description}</p>
                    <p>{product.long_description}</p>
                    {selectedVariation && (
                        <div className="selected-variant">
                            <p>Color: {selectedVariation.color}</p>
                            <div
                                className="color-preview"
                                style={{ backgroundColor: selectedVariation.color.toLowerCase() }}
                            />
                        </div>
                    )}
                </div>
                <button
                    onClick={() => handleAddCart(product)}
                    className="buy--btn"
                    disabled={!selectedVariation || selectedVariation.stock === 0}
                >
                    {!selectedVariation ? 'SELECT A SIZE' :
                        selectedVariation.stock === 0 ? 'OUT OF STOCK' :
                            'ADD TO CART'}
                </button>
            </div>
        </section >
    );
};

export default ProductDetails;