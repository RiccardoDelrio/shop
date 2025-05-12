import React from "react";
import { useGlobal } from "../contexts/GlobalContext";



const Carrello = () => {
    const { cartItems, setCartItems } = useGlobal()

    const totale = cartItems.reduce((acc, p) => acc + p.prezzo * p.quantita, 0);
    const iva = (totale * 0.22).toFixed(2);

    const handleRemoveItems = (index) => {

        setCartItems(cartItems.filter((item, idx) => idx !== index))
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
                                    <div>Qtà: {item.quantita}</div>
                                    <div>Subtotale: €{(item.price * item.quantita)}</div>
                                </div>
                                <div className="ms-3 d-flex flex-column justify-content-center align-items-center">
                                    <button className="btn btn-sm btn-outline-secondary mb-3"><i className="bi bi-plus-lg"></i></button>
                                    <button onClick={() => handleRemoveItems(index)} className="btn btn-sm btn-outline-danger"><i className="bi bi-x-lg"></i></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Colonna riepilogo */}
                    <div className="col-md-4">
                        <div className="border rounded p-4 " >
                            <h5>Riepilogo</h5>
                            <p>Subtotale: €{totale.toFixed(2)}</p>
                            <p>Spedizione: €0.00</p>
                            <p>IVA inclusa: €{iva}</p>
                            <p className="text-success">La spedizione è GRATUITA!</p>
                            <hr />
                            <h5><strong>Totale ordine: €{totale.toFixed(2)}</strong></h5>
                            <button className="btn btn-success w-100 mt-3">Procedi all'Acquisto</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carrello;
