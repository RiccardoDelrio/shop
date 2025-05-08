import Jumbotron from "../components/Jumbotron/jumbotron";
import CategoryCards from "../components/CategoryCards/CategoryCards";
import { useGlobal } from "../contexts/GlobalContext";
import { Link } from "react-router";
import Slider from "../components/Slider/Slider";
import ProductCards from "../components/ProductCard/ProductCard";
export default function Home() {
    const {
        fetchIndexMacroArea,
        accessories,
        setAccessories,
        bottom,
        setBottom,
        top,
        setTop,
        visualizedProducts,
        setVisualizedProducts,
        randomProducts
    } = useGlobal()
    console.log(randomProducts);
    const handleCategoryClick = (macroArea, setMacroArea, title) => {
        // Always update visualizedProducts with current data
        if (macroArea.length > 0) {
            setVisualizedProducts(macroArea);
            return; // Exit early if we already have data
        }

        // Only fetch if we don't have data
        fetchIndexMacroArea(title, (data) => {
            setMacroArea(data);
            setVisualizedProducts(data);
        });
    };
    console.log({ 'accessories': accessories, 'top': top, 'bottom': bottom });
    console.log('Prodotti visualizzati:', visualizedProducts);


    return (
        <div className="">
            <div className="main">
                <Jumbotron />
                <h1 className="home_title">
                    Discover timeless elegance: where style meets the art of high fashion.
                </h1>
                <div className="row row-cols-1 row-cols-lg-3 pt-5 mt-5">
                    <Link to={`/products/accessori`}>
                        <CategoryCards
                            onClick={() => handleCategoryClick(accessories, setAccessories, 'accessori')}
                            title="Accessories"
                            image="./img/accessories.jpg"
                        />
                    </Link>
                    <Link to={`/products/upper-body`}>
                        <CategoryCards
                            onClick={() => handleCategoryClick(top, setTop, 'upper-body')}
                            title="Upper Body"
                            image="./img/top.jpg"
                        />
                    </Link>
                    <Link to={`/products/lower-body`}>
                        <CategoryCards
                            onClick={() => handleCategoryClick(bottom, setBottom, 'lower-body')}
                            title="Lower Body"
                            image="./img/trousers.jpg"
                        />
                    </Link>
                </div>
                <h1 className="home_title ">Discover our collection</h1>
                <h1 className="home_title fs-1 p-0 m-0">Explore our curated selection of high-end fashion pieces.</h1>

                <Slider>
                    {randomProducts.map((product) => (
                        <ProductCards
                            key={product.id}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            image={product.images?.[0] || "/img/default.jpg"} // Usa un'immagine di default se non disponibile
                        />
                    ))}
                </Slider>


            </div>
        </div>
    );
}