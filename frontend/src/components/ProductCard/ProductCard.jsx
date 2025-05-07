import React from "react";
import "./ProductCards.css";

const ProductCards = ({ image, name, description, price }) => {
    return (
        <div className="col card_products">

            <div className="card">
                <img
                    className="card_background"
                    src="./img/prova.jpg"
                    alt={name}
                    width="1920"
                    height="2193"
                />
                <div className="card_content flow w-100">
                    <div className="card_content--container flow">
                        <h2 className="card_title">{name}</h2>
                        <p className="card_description ">
                            {description}
                        </p>
                    </div>
                    <button className="btn card_button">Dettagli</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCards;