import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext()

function GlobalProvider({ children }) {
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState([])
    const [top, setTop] = useState([])
    const [bottom, setBottom] = useState([])
    const [accessories, setAccessories] = useState([])
    function fetchIndex() {
        fetch('http://localhost:3000/api/v1/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data)

            })
    }
    function fetchIndexMacroArea(macroArea, setResults) {
        fetch(`http://localhost:3000/api/v1/products?macro_area=${macroArea}`)
            .then(res => res.json())
            .then(data => {
                setResults(data)
            })
    }
    useEffect(() => {
        fetchIndex()
        fetchIndexMacroArea('top', setTop)
        fetchIndexMacroArea('bottom', setBottom)
        fetchIndexMacroArea('accessories', setAccessories)
    }, [])
    const groupedProducts = products.reduce((groups, product) => {
        const group = groups[product.group_id] || [];
        group.push(product);
        groups[product.group_id] = group;
        return groups;
    }, {});


    return (
        <GlobalContext.Provider
            value={{
                products,
                top,
                bottom,
                accessories,
                cartItems,
                setCartItems,
                groupedProducts,
            }}
        >
            {children}

        </GlobalContext.Provider>
    )
}
function useGlobal() {
    const context = useContext(GlobalContext)
    return context
}
export { GlobalProvider, useGlobal }

