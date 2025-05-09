import { useGlobal } from "../contexts/GlobalContext";
import { useEffect, useState } from "react";
import ProductCards from "../components/ProductCard/ProductCard";

export default function Catalogo() {
    const { fetchMacroareas } = useGlobal(); // Removed as it is unused
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [isGridView, setIsGridView] = useState(true);

    // Fetch iniziale dei prodotti
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Fetch dei prodotti con filtri
    const fetchProducts = async (categorySlug = '') => {
        setLoading(true);
        try {
            const url = categorySlug
                ? `http://localhost:3000/api/v1/categories/${categorySlug}`
                : 'http://localhost:3000/api/v1/products';
            const response = await fetch(url);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    // Fetch delle categorie
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Gestione cambio categoria
    const handleCategoryChange = (e) => {
        const categorySlug = e.target.value;
        setSelectedCategory(categorySlug);
        if (categorySlug) {
            fetchProducts(categorySlug);
        } else {
            fetchProducts();
        }
    };

    const toggleView = () => {
        setIsGridView(!isGridView);
    };

    return (
        <div className="catalogo-container">
            {/* Header fisso con controlli */}
            <div className="catalogo-header">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <label className="form-label me-2 text-white">Categoria:</label>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Tutte le categorie</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="btn btn-outline-light" onClick={toggleView}>
                        <i className={`bi ${isGridView ? 'bi-list' : 'bi-grid-3x3-gap'}`}></i>
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
                            <div className={`row ${isGridView ? 'row-cols-1 row-cols-md-2 row-cols-xl-3' : 'row-cols-1'} g-4`}>
                                {products.map((product) => (
                                    <ProductCards
                                        key={product.id}
                                        name={product.name}
                                        description={product.description}
                                        price={product.price}
                                        image={product.images?.[0]?.url || "/img/default.jpg"}
                                        slug={product.slug}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
