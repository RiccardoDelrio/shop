import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useGlobal } from '../contexts/GlobalContext'
import ProductCards from "../components/ProductCard/ProductCard"
import Slider from "../components/Slider/Slider"

export default function MacroAreaPage() {
    const { slug } = useParams()
    const { macroareas, categoryProducts, fetchMacroareas, fetchCategoryProducts } = useGlobal()

    useEffect(() => {
        fetchMacroareas()
    }, [])

    const macroarea = macroareas.find(m => m.slug === slug)

    useEffect(() => {
        if (macroarea) {
            macroarea.categories.forEach(category => {
                if (!categoryProducts[category.slug]) {
                    fetchCategoryProducts(category.slug)
                }
            })
        }
    }, [macroarea])

    if (!macroarea) return <div>Loading...</div>

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-5">{macroarea.name}</h1>
            {macroarea.categories.map(category => (
                categoryProducts[category.slug]?.length > 0 && (
                    <div key={category.id} className="mb-5">
                        <h2 className="mb-4">{category.name}</h2>
                        <Slider>
                            {categoryProducts[category.slug].map(product => (
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
                )
            ))}
        </div>
    )
}
