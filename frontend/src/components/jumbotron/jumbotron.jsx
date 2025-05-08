import './jumbotron.css';
import React, { useState, useEffect } from "react";

const slidesData = [
    {
        id: 1,
        imgPrev: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img1.1.jpg",
        imgNext: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img1.jpg",
        alt: "Gallery Slide - 1",
    },
    {
        id: 2,
        imgPrev: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img2.1.jpg",
        imgNext: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img2.jpg",
        alt: "Gallery Slide - 2",
    },
    {
        id: 3,
        imgPrev: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img3.1.jpg",
        imgNext: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img3.jpg",
        alt: "Gallery Slide - 3",
    },
    {
        id: 4,
        imgPrev: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img4.1.jpg",
        imgNext: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img4.jpg",
        alt: "Gallery Slide - 4",
    },
    {
        id: 5,
        imgPrev: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img5.1.jpg",
        imgNext: "https://bato-web-agency.github.io/bato-shared/img/gallery-slider/img5.jpg",
        alt: "Gallery Slide - 5",
    },
];

const Jumbotron = () => {
    const [activeSlide, setActiveSlide] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev % slidesData.length) + 1);
        }, 3000); // Auto-scroll every 3 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="">
            <div className="jumbotron row d-none d-lg-flex ">
                {/* Desktop Gallery */}
                <div className="gallery-slider col  ">
                    <div className="gallery-slider__wrapper ">
                        {slidesData.map((slide) => (
                            <div
                                key={slide.id}
                                className={`gallery-slider__slide ${slide.id === activeSlide ? "active" : ""}`}
                            >
                                <div className="gallery-slider__image">
                                    <img
                                        className="gallery-slider__img-prev"
                                        src={slide.imgPrev}
                                        alt={slide.alt}
                                    />
                                    <img
                                        className="gallery-slider__img-next"
                                        src={slide.imgNext}
                                        alt={slide.alt}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Slider */}
            </div>
            <div className="mobile-jumbo  d-lg-none">
                <img src="./img/jumbo-mobile.jpeg" alt="Mobile Jumbotron" />
                <h1 className="text-center ">Boolean</h1>
            </div>
        </div>
    );
};

export default Jumbotron;