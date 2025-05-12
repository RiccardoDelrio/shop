import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCards from '../components/ProductCard/ProductCard'
import ProductCardListView from '../components/ProductCarListView/ProductCarListView'
export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [products, setProducts] = useState([])
    const [isGridView, setIsGridView] = useState(true);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        setQuery(searchParams.get('q') || '')


        fetch(`http://localhost:3000/api/v1/products/search?query=${query}`)
            .then(res => {

                return res.json()
            })
            .then(data => {
                setProducts(data)
                console.log(data, "questi sono i prodotti")
            })
            .catch(err => {
                console.error(err)
            })
            .finally(() => setLoading(false))

    }, [query, searchParams])
    const toggleView = () => {
        setIsGridView(!isGridView);
    };

    return (
        <div className="catalogo-container">
            {/* Header fisso con controlli */}
            <div className="catalogo-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="catalogo-title">Risultati per: {query}</h2>
                    <button className="btn btn-outline-light" onClick={toggleView}>
                        <i className={`bi ${isGridView ? 'bi-grid-3x3-gap' : 'bi-list'}`}></i>
                    </button>
                </div>
            </div>

            {/* Contenuto principale scorrevole */}
            <div className="catalogo-content">
                <div className="row g-4">
                    {/* Griglia Prodotti */}
                    <div className="col-products">
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className={`row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4  g-4`}>
                                {products.map((product) => (

                                    isGridView ? (<ProductCards
                                        key={product.id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        image={`http://localhost:3000/imgs/${product.images[0].url}`}
                                        slug={product.slug}
                                        {...(product.discount > 0 ? { discount: product.discount.slice(0, -3) } : {})} // Conditionally add the discount prop

                                    />) : (<ProductCardListView
                                        key={`List-${product.id}`}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        image={product.images?.[0] ?? null}
                                        slug={product.slug}

                                    />)

                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    )
}


