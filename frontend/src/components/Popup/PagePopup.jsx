import { useState, useEffect } from "react";
import './PagePopup.css';

export default function WelcomePopup() {
    // Stati per gestire il popup
    const [showPopup, setShowPopup] = useState(false);    // Controlla la visibilità del popup
    const [email, setEmail] = useState("");               // Memorizza l'email inserita
    const [message, setMessage] = useState("");           // Memorizza messaggi di feedback

    // Viene eseguito una volta quando il componente viene montato
    useEffect(() => {
        // Controlla se è la prima visita dell'utente
        const isFirstVisit = !localStorage.getItem("hasVisited");
        if (isFirstVisit) {
            setShowPopup(true); // Mostra il popup se è la prima visita
        }
    }, []); // Array vuoto = esegui solo al mount

    // Funzione per resettare il popup (per debug)
    const handleDebugReset = () => {
        localStorage.removeItem("hasVisited");  // Rimuove il flag dalla memoria
        setShowPopup(true);                    // Mostra il popup
        setMessage("");                        // Resetta eventuali messaggi
        setEmail("");                          // Resetta il campo email
    };

    // Gestisce l'invio del form
    const handleSubmit = (e) => {
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
                    throw new Error('Errore nella richiesta');
                }
                return response.json();
            })
            .then(() => {
                // Assumiamo che la risposta sia andata a buon fine se arriviamo qui
                setMessage("Grazie per l'iscrizione!");
                localStorage.setItem("hasVisited", "true");
                setTimeout(() => setShowPopup(false), 2000);
            })
            .catch(error => {
                console.error('Errore:', error);
                setMessage("Si è verificato un errore, ma la tua email potrebbe essere stata salvata");
            });
    };

    // Rendering condizionale del componente
    return (
        <>
            <button
                onClick={handleDebugReset}
                className="debug-button btn btn-danger"
            >
                Debug: Reset Popup
            </button>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content card">
                        <button
                            className="popup-close btn-close"
                            onClick={() => {
                                setShowPopup(false);
                                localStorage.setItem("hasVisited", "true");
                            }}
                            aria-label="Close"
                        />

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
                                <button type="submit" className="btn btn-primary w-100">
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
            )}
        </>
    );
}