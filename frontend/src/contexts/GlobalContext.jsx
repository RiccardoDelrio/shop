import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext()

function GlobalProvider({ children }) {
    /*     const [products, setProducts] = useState([]);
 */ const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);
    const [top, setTop] = useState([]);
    const [bottom, setBottom] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [category, setCategory] = useState('')
    const [visualizedProducts, setVisualizedProducts] = useState([])
    const [wardrobeSections, setWardrobeSections] = useState([]); // this is the main state
    const [categoryProducts, setCategoryProducts] = useState({});
    const [discount, setDiscount] = useState([]); // State for discount products


    // Fetch 10 random products
    function fetchBestSellers() {
        fetch('http://localhost:3000/api/v1/products/bestsellers')
            .then(res => res.json())
            .then(data => {
                setBestSellers(data); // Save random products to state
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

    function fetchWardrobeSections() {
        fetch('http://localhost:3000/api/v1/wardrobe-sections')
            .then(res => res.json())
            .then(data => setWardrobeSections(data));
    }

    function fetchCategoryProducts(slug) {
        fetch(`http://localhost:3000/api/v1/categories/${slug}`)
            .then(res => res.json())
            .then(data => {
                setCategoryProducts(prev => ({ ...prev, [slug]: data }));
            });
    }
    function fetchDiscount() {
        fetch('http://localhost:3000/api/v1/products/discounted')
            .then(res => res.json())
            .then(data => {
                setDiscount(data); // Save filtered products to the provided setter
            });
    }

    useEffect(() => {
        fetchBestSellers(); // Fetch random products on load
        fetchDiscount()
    }, []);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }, [cartItems])


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
                bestSellers,
                category, // Expose random products
                visualizedProducts,
                setVisualizedProducts,
                fetchProductsByCategory,
                fetchBestSellers,
                wardrobeSections,
                categoryProducts,
                fetchWardrobeSections,
                fetchCategoryProducts,
                discount
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

