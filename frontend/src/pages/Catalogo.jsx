import { useGlobal } from "../contexts/GlobalContext"; // Corretto il percorso

export default function Catalogo() {
    const { groupedProducts } = useGlobal();

    return (
        <>
            <div className="main">
                <div className="row row-cols-1 row-cols-lg-3 pt-5 mt-5 gap-lg-2 gap-sm-3">
                    {groupedProducts.map((products) => {
                        const product = products[0]; // Prendi solo il primo oggetto di ogni array
                        return (
                            <div className="col col_category" key={product.id}>
                                <div className="card border-0">
                                    <img
                                        src={`./img/${product.image}`}
                                        className="card-img"
                                        alt={product.name}
                                    />
                                    <div className="card-img-overlay p-0 d-flex flex-column justify-content-center align-items-center">
                                        <h1 className="card-title text-center">{product.name}</h1>
                                        <p className="card-text text-center">€{product.price}</p>
                                        <p className="card-text text-center">{product.description}</p>
                                        <p className="card-text text-center">Stock: {product.stock}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}