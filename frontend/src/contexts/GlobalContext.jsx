import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext()

function GlobalProvider({ children }) {
    const [products, setProducts] = useState([])
    function fetchIndex() {
        fetch('http://localhost:3000/api/v1/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data)

            })
    }
    useEffect(() => {
        fetchIndex()
    }, [])

    return (
        <GlobalContext.Provider
            value={{
                products,
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