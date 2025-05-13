import { useState, useEffect } from "react";
import './PagePopup.css';

export default function WelcomePopup() {
    const [showPopup, setShowPopup] = useState(false);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // Funzione per controllare se il popup deve essere mostrato
    function checkLastVisit() {
        const lastVisit = localStorage.getItem("lastVisitDate");
        const today = new Date().toDateString();
        return !lastVisit || lastVisit !== today;
    }

    useEffect(() => {
        // Mostra il popup se è un nuovo giorno
        if (checkLastVisit()) {
            setShowPopup(true);
            localStorage.setItem("lastVisitDate", new Date().toDateString());
        }
    }, []);

    // Rimuovi la data per far riapparire il popup
    localStorage.removeItem("lastVisitDate");


    // Gestione chiusura popup
    function handleClose() {
        setShowPopup(false);
    }

    // Gestione form submission
    function handleSubmit(e) {
        e.preventDefault();

        fetch("http://localhost:3000/api/v1/newsletter/subscribe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 409) {
                        throw new Error('Email già registrata');
                    }
                    throw new Error('Errore nella richiesta');
                }
                return response.json();
            })
            .then(() => {
                setMessage("Grazie per l'iscrizione! Controlla la tua email per la conferma.");
                setTimeout(() => {
                    setShowPopup(false);
                    setMessage("");
                }, 3000);
            })
            .catch(error => {
                console.error('Errore:', error);
                setMessage(error.message || "Si è verificato un errore durante l'iscrizione");
            });
    }

    return (
        <>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content card">
                        <button
                            className="popup-close btn-close"
                            onClick={handleClose}
                            aria-label="Close"
                        />
                        <div className="popup-grid">
                            <div className="popup-left">
                                <img src="../../../public/img/imgpopup.png" alt="Newsletter" className="popup-image" />
                            </div>
                            <div className="popup-right">
                                <div className="card-body text-center">
                                    <h2 className="card-title mb-4">Benvenuto!</h2>
                                    <p className="card-text mb-4">
                                        Iscriviti alla nostra newsletter per ricevere offerte esclusive
                                    </p>

                                    <form onSubmit={handleSubmit} className="newsletter-form">
                                        <div className="form-floating mb-3">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="emailInput"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Inserisci la tua email"
                                                required
                                            />
                                            <label htmlFor="emailInput">Email</label>
                                        </div>
                                        <button type="submit" className="btn button w-100">
                                            Iscriviti
                                        </button>
                                    </form>

                                    {message && (
                                        <div className="alert alert-success mt-3" role="alert">
                                            {message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}