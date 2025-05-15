import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UnsubscribeNewsletter.css';

export default function UnsubscribeNewsletter() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/api/v1/newsletter/unsubscribe/${email}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage('Ti sei disiscritto con successo dalla newsletter.');
                // Aggiungiamo un timeout per dare il tempo all'utente di leggere il messaggio
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Si è verificato un errore durante la disiscrizione.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Si è verificato un errore di connessione.');
        }
    };

    return (
        <div className="unsubscribe-container">
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card unsubscribe-card">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <i className="fas fa-envelope-open-text unsubscribe-icon"></i>
                                    <h2 className="mt-3">Disiscrizione Newsletter</h2>
                                    <p className="text-muted">
                                        Ci dispiace vederti andare via. Inserisci la tua email per confermare la disiscrizione.
                                    </p>
                                </div>

                                {message && (
                                    <div className={`alert ${status === 'success' ? 'alert-success' : 'alert-danger'} fade show`}>
                                        <i className={`fas ${status === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="unsubscribe-form">
                                    <div className="form-floating mb-4">
                                        <input
                                            type="email"
                                            className="form-control custom-input"
                                            id="emailInput"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="La tua email"
                                            required
                                        />
                                        <label htmlFor="emailInput">Email</label>
                                    </div>
                                    <button type="submit" className="btn btn-danger btn-lg w-100 unsubscribe-btn">
                                        <i className="fas fa-times-circle me-2"></i>
                                        Disiscriviti
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <a href="/" className="text-muted text-decoration-none">
                                        <i className="fas fa-arrow-left me-2"></i>
                                        Torna alla homepage
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}