import React from "react";
import { useGlobal } from "../contexts/GlobalContext";



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
            console.log(thisItemsPrice);

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
                                    <div className="mt-2">Prezzo: €{item.price}</div>
                                    <div>Qtà: {item.quantità}</div>
                                    <div>Subtotale: €{(item.price * item.quantità)}</div>
                                </div>
                                <div className="ms-3 d-flex flex-column justify-content-center align-items-center">
                                    <button onClick={() => handleIncrement(item, 'add')} className="btn btn-sm btn-outline-secondary mb-3"><i className="bi bi-plus-lg"></i></button>
                                    <button onClick={() => handleRemoveItems(index)} className="btn btn-sm btn-outline-danger"><i className="bi bi-x-lg"></i></button>
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
                            <button disabled={cartItems.length === 0} className="btn btn-success w-100 mt-3">Procedi all'Acquisto</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrello;
