import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCards from '../components/ProductCard/ProductCard'
import ProductCardListView from '../components/ProductCarListView/ProductCarListView'

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [isGridView, setIsGridView] = useState(true);
    const [loading, setLoading] = useState(true);

    // Leggi i filtri direttamente da searchParams
    const filters = {
        category: searchParams.get('category') || '',
        macroarea: searchParams.get('macroarea') || '',
        search: searchParams.get('search') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        color: searchParams.get('color') || '',
        size: searchParams.get('size') || '',
        discounted: searchParams.get('discounted') === 'true',
        inStock: searchParams.get('inStock') === 'true'

    };

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newSearchParams = new URLSearchParams(searchParams);

        if (type === 'checkbox') {
            if (checked) {
                newSearchParams.set(name, 'true');
            } else {
                newSearchParams.delete(name);
            }
        } else {
            if (value) {
                newSearchParams.set(name, value);
            } else {
                newSearchParams.delete(name);
            }
        }

        setSearchParams(newSearchParams);
    };

    const getImageUrl = (product) => {
        try {
            if (product.images && Array.isArray(product.images) && product.images.length > 0 && product.images[0].url) {
                return `http://localhost:3000/imgs/${product.images[0].url}`;
            }
            return 'http://localhost:3000/imgs/placeholder.jpg';
        } catch (error) {
            return 'http://localhost:3000/imgs/placeholder.jpg';
        }
    };

    useEffect(() => {
        setLoading(true);
        const apiUrl = new URL('http://localhost:3000/api/v1/products/filter');

        // Convert searchParams to URLSearchParams if it isn't already
        const params = new URLSearchParams(searchParams);

        // Se c'è un parametro 'q', copialo come 'search'
        if (params.has('q')) {
            params.set('search', params.get('q'));
            params.delete('q');
        }

        // Aggiungi i parametri all'URL dell'API
        apiUrl.search = params.toString();

        fetch(apiUrl)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('Data received is not an array');
                }
                setProducts(data);
            })
            .catch(err => {
                console.error('Error fetching products:', err);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, [searchParams]);

    const toggleView = () => {
        setIsGridView(!isGridView);
    };

    return (
        <div className="catalogo-container">
            {/* Header fisso con controlli */}
            <div className="catalogo-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h2 className="catalogo-title">
                        {filters.search ? `Risultati per: ${filters.search}` : 'Tutti i prodotti'}
                    </h2>
                    <button className="btn btn-outline-light" onClick={toggleView}>
                        <i className={`bi ${isGridView ? 'bi-grid-3x3-gap' : 'bi-list'}`}></i>
                    </button>
                </div>
            </div>

            {/* Contenuto principale scorrevole */}
            <div className="catalogo-content">
                <div className="row g-4">
                    {/* Sidebar Filtri */}
                    <div className="col-lg-3">
                        <div className="filter-sidebar p-3 rounded">
                            <h4 className="mb-3">Filtri</h4>

                            <div className="mb-3">
                                <label className="form-label">MacroArea</label>
                                <select
                                    type="text"
                                    className="form-control text-black "
                                    name="macroarea"
                                    value={filters.macroarea}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Tutti</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="upper-body">Top and Coats</option>
                                    <option value="lower-body">Skirts and Trousers</option>
                                    <option value="dress">Dresses</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Categoria</label>
                                <select
                                    className="form-select text-black"
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Tutte</option>
                                    <option value="orecchini">Orecchini</option>
                                    <option value="bracciali">Bracciali</option>
                                    <option value="collane">Collane</option>
                                    <option value="giacche">Giacche</option>
                                    <option value="cappotti">Cappotti</option>
                                    <option value="maglie">Maglie</option>
                                    <option value="maglioni">Maglioni</option>
                                    <option value="pantaloni">Pantaloni</option>
                                    <option value="gonne">Gonne</option>
                                    <option value="vestitini">Vestitini</option>
                                </select>
                            </div>
                            <div className="mb-3">

                                <label className="form-label">Prezzo Minimo</label>
                                <input
                                    type="number"
                                    className="form-control text-black"
                                    name="minPrice"
                                    value={filters.minPrice}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Prezzo Massimo</label>
                                <input
                                    type="number"
                                    className="form-control text-black"
                                    name="maxPrice"
                                    value={filters.maxPrice}
                                    onChange={handleFilterChange}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Colore</label>
                                <select
                                    className="form-select text-black"
                                    name="color"
                                    value={filters.color}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Tutti</option>
                                    <option value="black">Nero</option>
                                    <option value="white">Bianco</option>
                                    <option value="red">Rosso</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Taglia</label>
                                <select
                                    className="form-select text-black"
                                    name="size"
                                    value={filters.size}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Tutte</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                </select>
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="discounted"
                                    checked={filters.discounted}
                                    onChange={handleFilterChange}
                                    id="discounted"
                                />
                                <label className="form-check-label" htmlFor="discounted">
                                    Solo Prodotti Scontati
                                </label>
                            </div>

                            <div className="mb-3 form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="inStock"
                                    checked={filters.inStock}
                                    onChange={handleFilterChange}
                                    id="inStock"
                                />
                                <label className="form-check-label" htmlFor="inStock">
                                    Solo Disponibili
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Griglia Prodotti */}
                    <div className="col-lg-9">
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
                                        image={getImageUrl(product)}
                                        slug={product.slug}
                                        {...(product.discount > 0 ? { discount: product.discount.slice(0, -3) } : {})} // Conditionally add the discount prop

                                    />) : (<ProductCardListView
                                        key={`List-${product.id}`}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        image={getImageUrl(product)}
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


