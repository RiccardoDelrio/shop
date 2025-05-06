import Jumbotron from "../components/Jumbotron/jumbotron";
import CategoryCards from "../components/CategoryCards/CategoryCards";
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

            </div>
        </div>
    );
}