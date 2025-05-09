import React from "react";


const prodotti = [
    {
        id: 1,
        nome: "vestito Elegante",
        prezzo: 10.95,
        quantita: 1,
        img: "https://picsum.photos/200/300"
    },
    {
        id: 2,
        nome: "Borsa in Pelle Nera",
        prezzo: 17.95,
        quantita: 1,
        img: "https://picsum.photos/200/300"
    },
    {
        id: 3,
        nome: "Scarpe con Tacco",
        prezzo: 17.95,
        quantita: 1,
        img: "https://picsum.photos/200/300"
    },
    {
        id: 4,
        nome: "Gonna Plissettata",
        prezzo: 17.95,
        quantita: 1,
        img: "https://picsum.photos/200/300"
    }
    // Aggiungi altri prodotti se vuoi
];

const Carrello = () => {
    const totale = prodotti.reduce((acc, p) => acc + p.prezzo * p.quantita, 0);
    const iva = (totale * 0.22).toFixed(2);

    return (
        <div className="main-container">


            <div className="container py-4">
                <div className="row">
                    {/* Colonna prodotti */}
                    <div className="col-md-8">
                        <h4>Oggetto</h4>
                        <hr />
                        {prodotti.map((p) => (
                            <div key={p.id} className="d-flex mb-4 border-bottom pb-3">
                                <img src={p.img} alt={p.nome} width="80" height="80" className="me-3" />
                                <div className="flex-grow-1">
                                    <strong className="text-danger">{p.nome}</strong>
                                    <div className="mt-2">Prezzo: €{p.prezzo.toFixed(2)}</div>
                                    <div>Qtà: {p.quantita}</div>
                                    <div>Subtotale: €{(p.prezzo * p.quantita).toFixed(2)}</div>
                                </div>
                                <div className="ms-3 d-flex flex-column justify-content-center align-items-center">
                                    <button className="btn btn-sm btn-outline-secondary mb-3"><i class="bi bi-plus-lg"></i></button>
                                    <button className="btn btn-sm btn-outline-danger"><i class="bi bi-x-lg"></i></button>
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
