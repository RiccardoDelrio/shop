import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }; const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Utilizza la funzione login fornita dal contesto di autenticazione
            const response = await login(formData.email, formData.password);

            if (!response || !response.token) {
                throw new Error("Errore: Token non ricevuto dal server");
            }

            // Imposta il messaggio di successo
            setSuccess(true);

            // Aggiungiamo un piccolo ritardo per garantire che il contesto di autenticazione 
            // abbia il tempo di aggiornarsi prima del reindirizzamento
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (err) {
            setError(err.message || "Errore durante il login. Verifica le tue credenziali.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Accedi</h2>

                {success && (
                    <div className="alert alert-success" role="alert">
                        Login effettuato con successo! Verrai reindirizzato...
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Accesso in corso...' : 'Accedi'}
                    </button>
                </form>

                <div className="auth-redirect">
                    Non hai un account? <Link to="/register">Registrati</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
