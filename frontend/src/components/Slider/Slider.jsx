import React, { useRef, useEffect } from "react";
import "./Slider.css";

const Slider = ({ children }) => {
    const rowRef = useRef(null);

    const slide = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const rowElement = rowRef.current;
        if (rowElement) {
            const handleTouchStart = () => { };
            rowElement.addEventListener("touchstart", handleTouchStart, { passive: true });
            return () => {
                rowElement.removeEventListener("touchstart", handleTouchStart);
            };
        }
    }, []);

    return (
        <div className="slider-container">
            <button className="slider-button left" onClick={() => slide("left")}>
                &#8249;
            </button>
            <div className="slider-content" ref={rowRef}>
                {children}
            </div>
            <button className="slider-button right" onClick={() => slide("right")}>
                &#8250;
            </button>
        </div>
    );
};

export default Slider;
