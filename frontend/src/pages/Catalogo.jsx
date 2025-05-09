import { useGlobal } from "../contexts/GlobalContext";
import { useEffect, useState } from "react";
import ProductCards from "../components/ProductCard/ProductCard";

export default function Catalogo() {
    const { fetchMacroareas } = useGlobal();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Sidebar con filtri */}
                <div className="col-md-3">
                    <div className="card p-3">
                        <h5 className="mb-3">Filtri</h5>

                        {/* Filtro Categorie */}
                        <div className="mb-4">
                            <label className="form-label">Categoria</label>
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
                    </div>
                </div>

                {/* Griglia Prodotti */}
                <div className="col-md-9">
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
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
    );
}