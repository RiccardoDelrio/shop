import React, { useEffect } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router'
import { useGlobal } from '../contexts/GlobalContext'
import ProductCards from "../components/ProductCard/ProductCard";

const MacroAreaPage = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const params = new URLSearchParams();

    const setMultipleParams = () => {
        setSearchParams(params)

    }
    useEffect(() => {
        setMultipleParams()
        fetchData()
    }, [])
    console.log(searchParams.getAll('macro_area'));
    console.log('params', params);

    /* Params */
    const { slug } = useParams()
    /* Global context */
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

    /* Find this area */

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

    const thisArea = areas.find(area => area.name === slug) || null

    console.log(thisArea);

    const foundedArea = areas.filter(area => searchParams.getAll('macro_area').includes(area.name))
    console.log('FindArea', foundedArea);


    /*     function fetchData() {
            if (visualizedProducts.length < 1) {
                fetchIndexMacroArea(thisArea.name, (data) => {
                    thisArea.setState(data)
                    setVisualizedProducts(data)
                })
    
            }
        } */
    function fetchData() {
        if (visualizedProducts.length < 1) {
            let allProducts = [];
            let completedFetches = 0
            foundedArea.forEach(area => {
                fetchIndexMacroArea(area.name, (data) => {
                    area.setState(data)
                    allProducts = [...allProducts, ...data]
                    completedFetches++
                    if (completedFetches === foundedArea.length) {
                        setVisualizedProducts(allProducts)
                    }
                })
            })
        }
    }
    /*     useEffect(() => {
            if (thisArea) {
    
                fetchData()
            }
        }, [slug]) */



    console.log('Prodotti visualizzati', visualizedProducts);
    function handleCheck(e) {
        const current = new URLSearchParams(searchParams);
        const name = e.target.name;

        if (searchParams.getAll('macro_area').includes(name)) {
            // Rimuovi il parametro
            current.delete('macro_area', name);
        } else {
            // Aggiungi il parametro
            current.append('macro_area', name);
        }

        setSearchParams(current);
    }

    return (
        <div>

        </div>
    )
}

export default MacroAreaPage
