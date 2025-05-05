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

    const handleSlideClick = (id) => {
        setActiveSlide(id);
    };

    return (
        <div className="jumbotron main-container">
            <div className="gallery-slider d-none d-sm-block">
                <div className="gallery-slider__wrapper">
                    {slidesData.map((slide) => (
                        <div
                            key={slide.id}
                            className={`gallery-slider__slide ${slide.id === activeSlide ? "active" : ""}`}
/*                             onClick={() => handleSlideClick(slide.id)}
 */                        >
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

            <div className="mobile-slider d-sm-none">
                <img
                    src={slidesData[activeSlide - 1].imgNext}
                    alt={slidesData[activeSlide - 1].alt}
                    className="mobile-slider__image"
                />
            </div>


        </div>
    );
};

export default Jumbotron;