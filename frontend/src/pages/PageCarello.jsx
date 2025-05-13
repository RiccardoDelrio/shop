import React from "react";
import { useGlobal } from "../contexts/GlobalContext";
import { Link } from "react-router";



const Carrello = () => {
    const { cartItems, setCartItems } = useGlobal()

    const iva = Number((calculateSubTotal(cartItems) * 0.22).toFixed(2));
    const shipPrice = 0

    const handleRemoveItems = (index) => {

        setCartItems(cartItems.filter((item, idx) => idx !== index))
    }
    function calculateSubTotal(items) {
        let total = 0
        items.forEach(item => {
            const thisItemsPrice = item.price * item.quantità


            total += thisItemsPrice;
        })
        return total

    }
    function calculateTotal() {
        return calculateSubTotal(cartItems) + iva + shipPrice
    }

    const handleIncrement = (thisProduct, functionality) => {
        const thisProductIndex = cartItems.indexOf(thisProduct)
        let updatedCart = [...cartItems];
        if (functionality === 'add') {

            updatedCart[thisProductIndex].quantità += 1;
        } else if (functionality === 'minus' && thisProduct.quantità > 1) {
            updatedCart[thisProductIndex].quantità -= 1;


        }
        setCartItems(updatedCart)

    }
    const calculateOriginalPrice = (item, discountedPrice, discountPercentage) => {
        if (Number(item.discount) > 0) {
            const discountFactor = 1 - discountPercentage / 100;
            const originalPrice = discountedPrice / discountFactor;
            return Number(originalPrice.toFixed(2));
        }


    }
    console.log('Cart Items', cartItems);



    return (
        <div className="main-container">


            <div className="container py-4">
                <div className="row">
                    {/* Colonna prodotti */}
                    <div className="col-md-8">
                        <h4>Oggetto</h4>
                        <hr />
                        {cartItems.map((item, index) => (
                            <div key={item.id} className="d-flex mb-4 border-bottom pb-3">
                                <img src={`http://localhost:3000/imgs/${item.images[0].url}`} alt={item.name} width="80" height="80" className="me-3" />
                                <div className="flex-grow-1">
                                    <strong className="text-danger">{item.name}</strong>
                                    <div className="mt-2">Prezzo: <span className="text-secondary text-decoration-line-through me-2">{calculateOriginalPrice(item, Number(item.price), Number(item.discount))}</span> €{item.price}</div>
                                    <div>Qtà: {item.quantità}</div>
                                    <div>Subtotale: €{(item.price * item.quantità)}</div>
                                </div>
                                <div className="ms-3 d-flex flex-column justify-content-center align-items-end">
                                    <button onClick={() => handleRemoveItems(index)} className="btn btn-sm btn-outline-danger mb-3"><i className="bi bi-x-lg"></i></button>
                                    <div className="d-flex gap-3">

                                        <button disabled={item.quantità === 1} onClick={() => handleIncrement(item, 'minus')} className="btn btn-sm btn-outline-secondary "><i className="bi bi-dash-lg"></i></button>
                                        <button disabled={item.variations.stock === item.quantità} onClick={() => handleIncrement(item, 'add')} className="btn btn-sm btn-outline-secondary "><i className="bi bi-plus-lg"></i></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Colonna riepilogo */}
                    <div className="col-md-4">
                        <div className="border rounded p-4 " >
                            <h5>Riepilogo</h5>
                            <p>Subtotale: {calculateSubTotal(cartItems)} €</p>
                            <p>IVA inclusa: {iva} €</p>
                            <p>Spedizione: {shipPrice} €</p>
                            {shipPrice === 0 && (<p className="text-success">La spedizione è GRATUITA!</p>)}
                            <hr />
                            <h5><strong>Totale ordine: {calculateTotal()} €</strong></h5>
                            <button disabled={cartItems.length === 0} className="btn btn-success w-100 mt-3"><Link className="text-decoration-none text-white" to={'/checkout'}>Procedi all'Acquisto</Link></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrello;
