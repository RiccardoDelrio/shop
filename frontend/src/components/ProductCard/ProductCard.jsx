import React from "react";
import "./ProductCards.css";

const ProductCards = ({ name, description, price, image }) => {
    return (

        <div className="col card-container d-flex justify-content-center align-items-center">
            <div className="card custom-card">

                <img src="/img/prova.jpg" alt={name} className="card-img" />
                <div className="card-hover">
                    <div className="card-hover-content ">
                        <h5 className="card-title px-3 ">{name}</h5>
                        <p className="card-description">{description}</p>
                        <p className="card-price">€{price}</p>
                        <div className="btn card-link">Dettagli</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCards;