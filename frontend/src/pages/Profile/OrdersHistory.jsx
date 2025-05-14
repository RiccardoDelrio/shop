import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './OrdersHistory.css';

const OrdersHistory = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser]);

    const fetchOrders = () => {
        const user = JSON.parse(localStorage.getItem('user'));

        // Verifica che l'utente esista
        if (user && user.id) {
            // Modifica l'URL per utilizzare il parametro nell'URL invece che come query parameter
            fetch(`/api/orders/user/${user.id}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setOrders(data.orders);
                    } else {
                        setError(data.error || 'Errore nel recuperare gli ordini');
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Errore nel recupero degli ordini:', error);
                    setError('Errore durante la connessione al server');
                    setLoading(false);
                });
        } else {
            setError('No user found');
            setLoading(false);
        }
    };

    // Formatta la data in formato italiano
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
    };

    // Calcola lo stato dell'ordine con il colore corrispondente
    const getOrderStatus = (status) => {
        const statusMap = {
            'pending': { text: 'In attesa', class: 'status-pending' },
            'processing': { text: 'In lavorazione', class: 'status-processing' },
            'shipped': { text: 'Spedito', class: 'status-shipped' },
            'delivered': { text: 'Consegnato', class: 'status-delivered' },
            'cancelled': { text: 'Annullato', class: 'status-cancelled' }
        };

        return statusMap[status] || { text: status, class: '' };
    };

    // Utility per convertire lo stato dell'ordine in un colore di badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Processing': return 'info';
            case 'Completed': return 'success';
            case 'Cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    // Utility per mostrare lo stato in italiano
    const getStatusLabel = (status) => {
        switch (status) {
            case 'Pending': return 'In attesa';
            case 'Processing': return 'In lavorazione';
            case 'Completed': return 'Completato';
            case 'Cancelled': return 'Annullato';
            default: return status;
        }
    };

    return (
        <div className="orders-container">
            <div className="orders-content">
                <h2>I miei ordini</h2>

                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Caricamento...</span>
                        </div>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="orders-empty">
                        <p>Non hai ancora effettuato ordini.</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/catalogo')}
                        >
                            Inizia a fare acquisti
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => {
                            const statusInfo = getOrderStatus(order.status);

                            return (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div>
                                            <h5>Ordine #{order.id}</h5>
                                            <p className="order-date">{formatDate(order.created_at)}</p>
                                        </div>
                                        <div className={`order-status ${statusInfo.class}`}>
                                            {statusInfo.text}
                                        </div>
                                    </div>

                                    <div className="order-details">
                                        <p>Data: {new Date(order.created_at).toLocaleDateString('it-IT')}</p>
                                        <p>Totale: €{order.final_price}</p>
                                    </div>

                                    <div className="order-items">
                                        {order.items.map(item => (
                                            <div key={item.id} className="order-item">
                                                {item.image && (
                                                    <img
                                                        src={`http://localhost:3000/imgs/${item.image}`}
                                                        alt={item.product_name}
                                                        width="50"
                                                    />
                                                )}
                                                <span>{item.product_name}</span>
                                                <span>
                                                    {item.color && `Colore: ${item.color}`}
                                                    {item.size && ` - Taglia: ${item.size}`}
                                                </span>
                                                <span>Quantità: {item.quantity}</span>
                                                <span>€{item.price}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="orders-actions">
                    <button
                        className="btn btn-link"
                        onClick={() => navigate('/profile')}
                    >
                        Torna al profilo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersHistory;
