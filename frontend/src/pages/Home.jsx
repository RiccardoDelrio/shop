import Jumbotron from "../components/Jumbotron/jumbotron";
import CategoryCards from "../components/CategoryCards/CategoryCards";
import { useGlobal } from "../contexts/GlobalContext";
import { Link } from "react-router";
import Slider from "../components/Slider/Slider";
import ProductCards from "../components/ProductCard/ProductCard";
import PagePopup from "../components/Popup/PagePopup";
export default function Home() {
    const {
        randomProducts, discount

    } = useGlobal()
    console.log(randomProducts);


    return (
        <div className="">
            <div className="main">
                < PagePopup />
                <Jumbotron />
                <h1 className="home_title">
                    Scopri l'eleganza senza tempo: dove lo stile incontra l'arte dell'alta moda.
                </h1>
                <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 pt-5 mt-5">
                    <Link to={`/macroarea/accessori`}>
                        <CategoryCards
                            title="Accessori"
                            image="./img/accessories.jpg"
                        />
                    </Link>
                    <Link to={`/macroarea/upper-body`}>
                        <CategoryCards
                            title="Parte Superiore"
                            image="./img/top.jpg"
                        />
                    </Link>
                    <Link to={`/macroarea/lower-body`}>
                        <CategoryCards
                            title="Parte Inferiore"
                            image="./img/trousers.jpg"
                        />
                    </Link>
                    <Link to={`/macroarea/dress`}>
                        <CategoryCards
                            title="Vestiti"
                            image="./img/dress.jpg"
                        />
                    </Link>
                </div>
                <h1 className="home_title ">Scopri la nostra collezione</h1>
                <h1 className="home_title fs-1 p-0 m-0">Esplora la nostra selezione curata di capi di alta moda.</h1>

                <Slider>
                    {randomProducts.map((product) => (
                        <ProductCards
                            key={product.id}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            image={`http://localhost:3000/imgs/${product.images[0].url}`}
                            slug={product.slug}
                            {...(product.discount > 0 ? { discount: product.discount.slice(0, -3) } : {})} // Conditionally add the discount prop

                        />
                    ))}
                </Slider>

                <h1 className="home_title ">Prodotti in sconto</h1>

                <Slider>
                    {discount.map((product) => (
                        <ProductCards
                            key={product.id}
                            name={product.name}
                            description={product.description}
                            price={product.price}
                            image={`http://localhost:3000/imgs/${product.images[0].url}`}
                            slug={product.slug}
                            {...(product.discount > 0 ? { discount: product.discount.slice(0, -3) } : {})} // Conditionally add the discount prop

                        />
                    ))}
                </Slider>


            </div>
        </div>
    );
}