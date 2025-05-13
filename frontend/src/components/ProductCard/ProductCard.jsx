import { Link } from "react-router-dom"; // Import Link for navigation
import "./ProductCards.css";

const ProductCards = ({ name, description, price, image, slug, discount }) => {
    const discountedPrice = discount ? price - (price * discount / 100) : price;
    const numericPrice = Number(price);

    return (

        <div className="col card-container d-flex justify-content-center align-items-center">
            <div className="card custom-card">
                {discount > 0 && (
                    <p className="position-absolute discounted-tag rounded-pill bg-warning px-3"><span className="h6">- </span>{discount}%</p>
                )}
                <img
                    src={image}
                    alt={name}
                    className="card-imges"
                />
                <div className="card-hover">
                    <div className="card-hover-content ">
                        <h5 className="card-title px-3 ">{name}</h5>
                        <p className="card-description">{description}</p>
                        {discount > 0 ? (
                            <>
                                <div>
                                    <span className="original-price text-decoration-line-through">€{numericPrice.toFixed(2)}</span>
                                    <span className="discounted-price ps-3">€{discountedPrice.toFixed(2)}</span>

                                </div>
                            </>
                        ) : (
                            <div>€{numericPrice.toFixed(2)}</div>
                        )}
                        <Link to={`/product/${slug}`} className="btn card-link">Dettagli</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCards;