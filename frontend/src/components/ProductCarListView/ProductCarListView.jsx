import React from "react";
import { Link } from "react-router-dom";
import "./ProductCardListView.css";

const ProductCardListView = ({ name, description, price, image, slug }) => {
    return (
        <div className="product-list-card">
            <div className="product-image">
                <img src={"/img/prova.jpg"} alt={name} />
            </div>
            <div className="product-details">
                <h4 className="product-name">{name}</h4>
                <p className="product-description">{description}</p>
                <p className="product-price">€{price}</p>
                <div>

                    <Link to={`/product/${slug}`} className="product-button">
                        Dettagli
                        <i className="fa-solid fa-arrow-right"></i>

                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCardListView;
