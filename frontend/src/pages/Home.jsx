import Jumbotron from "../components/Jumbotron/jumbotron";
import CategoryCards from "../components/CategoryCards/CategoryCards";
import ProductCards from "../components/ProductCard/ProductCard";
export default function Home() {

    return (
        <div className="">

            <div className="main ">

                <Jumbotron></Jumbotron>
                <h1 className="home_title ">Discover timeless elegance: where style meets the art of high fashion.</h1>
                <div className="row row-cols-1 row-cols-lg-3 pt-5 mt-5  " >
                    <CategoryCards
                        title="Accessories"
                        image="./img/accessories.jpg"

                    ></CategoryCards>
                    <CategoryCards
                        title="Upper Body"
                        image="./img/top.jpg"

                    ></CategoryCards>
                    <CategoryCards
                        title="Lower Body"
                        image="./img/trousers.jpg"

                    ></CategoryCards>
                </div>
                <h1 className="home_title ">Discover our collection</h1>
                <h1 className="home_title fs-1 p-0 m-0">Explore our curated selection of high-end fashion pieces.</h1>

                <div className="row row-cols-1 row-cols-lg-4 pt-5 mt-5  " >

                    <ProductCards></ProductCards>
                    <ProductCards></ProductCards>
                    <ProductCards></ProductCards>
                    <ProductCards></ProductCards>
                </div>

            </div>
        </div>
    );
}