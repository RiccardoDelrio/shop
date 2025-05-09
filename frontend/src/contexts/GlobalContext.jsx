import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext()

function GlobalProvider({ children }) {
    /*     const [products, setProducts] = useState([]);
 */    const [cartItems, setCartItems] = useState([]);
    const [top, setTop] = useState([]);
    const [bottom, setBottom] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]); // State for random products
    const [category, setCategory] = useState('')
    const [visualizedProducts, setVisualizedProducts] = useState([])
    const [dress, setDress] = useState([]); // State for dress category
    const [macroareas, setMacroareas] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});

    // Fetch all products
    /*     function fetchIndex() {
            fetch('http://localhost:3000/api/v1/products')
                .then(res => res.json())
                .then(data => {
                    setProducts(data);
                });
        } */

    // Fetch products by macro area
    function fetchIndexMacroArea(macroArea, callback) {
        fetch(`http://localhost:3000/api/v1/products/macroarea/${macroArea}`)
            .then(res => res.json())
            .then(data => {
                callback(data)

            });
    }

    // Fetch 10 random products
    function fetchRandomProducts() {
        fetch('http://localhost:3000/api/v1/products/random')
            .then(res => res.json())
            .then(data => {
                setRandomProducts(data); // Save random products to state
                return data
            });
    }

    // Fetch products by category
    function fetchProductsByCategory(categorySlug) {
        fetch(`http://localhost:3000/api/v1/products?category=${categorySlug}`)
            .then(res => res.json())
            .then(data => {
                setCategory(data); // Save filtered products to the provided setter
            });
    }

    function fetchMacroareas() {
        fetch('http://localhost:3000/api/v1/macroareas')
            .then(res => res.json())
            .then(data => setMacroareas(data));
    }

    function fetchCategoryProducts(slug) {
        fetch(`http://localhost:3000/api/v1/categories/${slug}`)
            .then(res => res.json())
            .then(data => {
                setCategoryProducts(prev => ({ ...prev, [slug]: data }));
            });
    }

    useEffect(() => {

        fetchRandomProducts(); // Fetch random products on load
    }, []);


    return (
        <GlobalContext.Provider
            value={{

                top,
                setTop,
                bottom,
                setBottom,
                accessories,
                setAccessories,
                cartItems,
                setCartItems,
                randomProducts,
                category, // Expose random products
                visualizedProducts,
                setVisualizedProducts,
                fetchProductsByCategory,
                fetchIndexMacroArea,
                fetchRandomProducts,
                randomProducts, // Expose category filter function
                dress,
                setDress,
                macroareas,
                categoryProducts,
                fetchMacroareas,
                fetchCategoryProducts,
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

