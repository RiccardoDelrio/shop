import React from "react";
import "./CategoryCards.css";

const CategoryCards = ({ image, title, price }) => {
    return (
        <div className="col col_category  ">

            <div class="card border-0 ">
                <img src={image} class="card-img" alt={title} />
                <div class="card-img-overlay p-0  d-flex flex-column justify-content-center align-items-center">
                    <h1 class="card-title text-center m  ">{title}</h1>
                </div>
            </div>
        </div>
    );

};

export default CategoryCards;