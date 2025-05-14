import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        } try {
            // Utilizza la funzione register fornita dal contesto di autenticazione
            await register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password
            });

            // Imposta il messaggio di successo            setSuccess(true);

            // Aggiungiamo un piccolo ritardo per garantire che il contesto di autenticazione 
            // abbia il tempo di aggiornarsi prima del reindirizzamento
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Register</h2>                {success && (
                    <div className="alert alert-success" role="alert">
                        Registration completed successfully! You will be redirected...
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                    </div>                    <div className="form-group">
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

                    <div className="form-group">
                        <label htmlFor="confirm_password">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirm_password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Registration in progress...' : 'Register'}
                    </button>
                </form>

                <div className="auth-redirect">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
