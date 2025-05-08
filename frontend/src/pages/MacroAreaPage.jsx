import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useGlobal } from '../contexts/GlobalContext'
import ProductCards from "../components/ProductCard/ProductCard";

const MacroAreaPage = () => {
    const { slug } = useParams()
    const {
        fetchIndexMacroArea,
        accessories,
        setAccessories,
        bottom,
        setBottom,
        top,
        setTop,
        visualizedProducts,
        setVisualizedProducts
    } = useGlobal()

    const areas = [{
        state: accessories,
        setState: setAccessories,
        name: 'accessori'

    }, {
        state: top,
        setState: setTop,
        name: 'upper-body'

    }, {
        state: bottom,
        setState: setBottom,
        name: 'lower-body'

    }]

    const thisArea = areas.find(area => area.name === slug)

    console.log(thisArea);


    function fetchData() {
        if (visualizedProducts.length < 1) {
            fetchIndexMacroArea(thisArea.name, (data) => {
                thisArea.setState(data)
                setVisualizedProducts(data)
            })

        }
    }
    useEffect(() => {
        fetchData()
    }, [slug])



    console.log(visualizedProducts);

    return (
        <div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3  row-cols-lg-4  row-gap-4  ">
                {visualizedProducts.map((product) => (
                    <ProductCards
                        name={product.name}
                        description={product.description}
                        price={product.price}
                    ></ProductCards>

                ))}
            </div>

        </div>
    )
}

export default MacroAreaPage
