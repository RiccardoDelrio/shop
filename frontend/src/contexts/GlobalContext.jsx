import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext()

function GlobalProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [top, setTop] = useState([]);
    const [bottom, setBottom] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]); // State for random products

    // Fetch all products
    function fetchIndex() {
        fetch('http://localhost:3000/api/v1/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            });
    }

    // Fetch products by macro area
    function fetchIndexMacroArea(macroArea, setResults) {
        fetch(`http://localhost:3000/api/v1/products?macro_area=${macroArea}`)
            .then(res => res.json())
            .then(data => {
                setResults(data);
            });
    }

    // Fetch 10 random products
    function fetchRandomProducts() {
        fetch('http://localhost:3000/api/v1/products/random')
            .then(res => res.json())
            .then(data => {
                setRandomProducts(data); // Save random products to state
            });
    }

    // Fetch products by category
    function fetchProductsByCategory(categorySlug, setResults) {
        fetch(`http://localhost:3000/api/v1/products?category=${categorySlug}`)
            .then(res => res.json())
            .then(data => {
                setResults(data); // Save filtered products to the provided setter
            });
    }

    useEffect(() => {
        fetchIndex();
        fetchIndexMacroArea('top', setTop);
        fetchIndexMacroArea('bottom', setBottom);
        fetchIndexMacroArea('accessories', setAccessories);
        fetchRandomProducts(); // Fetch random products on load
    }, []);


    return (
        <GlobalContext.Provider
            value={{
                products,
                top,
                bottom,
                accessories,
                cartItems,
                setCartItems,
                randomProducts, // Expose random products
                fetchProductsByCategory, // Expose category filter function
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
function useGlobal() {
    const context = useContext(GlobalContext)
    return context
}
export { GlobalProvider, useGlobal }

