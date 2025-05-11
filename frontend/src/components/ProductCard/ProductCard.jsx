import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./ProductCards.css";

const ProductCards = ({ name, description, price, image, slug }) => {
    return (

        <div className="col card-container d-flex justify-content-center align-items-center">
            <div className="card custom-card">
                <img
                    src={image}
                    alt={name}
                    className="card-imges"
                />
                <div className="card-hover">
                    <div className="card-hover-content ">
                        <h5 className="card-title px-3 ">{name}</h5>
                        <p className="card-description">{description}</p>
                        <p className="card-price">€{price}</p>
                        <Link to={`/product/${slug}`} className="btn card-link">Dettagli</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCards;