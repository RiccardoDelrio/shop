import React, { useState, useEffect } from 'react'
import './checkout.css'
import { useGlobal } from '../../contexts/GlobalContext'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import {
    useStripe,
    useElements,
    CardElement,
} from '@stripe/react-stripe-js';

const Checkout = () => {
    const { cartItems, setCartItems } = useGlobal()
    const { currentUser, updateProfile } = useAuth()
    const isAuthenticated = !!currentUser
    const stripe = useStripe()
    const elements = useElements()
    const [clientSecret, setClientSecret] = useState('')
    const [formData, setFormData] = useState({})
    const [formStatus, setFormStatus] = useState(null)
    const [formCheck, setFormCheck] = useState(null)    // Stato per il messaggio di aggiornamento del profilo
    const [updateMessage, setUpdateMessage] = useState('')    // Precompila i dati del form con le informazioni dell'utente loggato
    const [isLoading, setIsLoading] = useState(false)
    const [cartSummary, setCartSummary] = useState([]) // Stato per memorizzare i dati del carrello dal localStorage
    const [isAccordionOpen, setIsAccordionOpen] = useState(false) // Stato per il toggle dell'accordion


    useEffect(() => {
        console.log("Cart items:", cartItems);
        const totalAmount = cartItems.reduce((acc, item) => {
            return acc + item.price * item.quantità;
        }, 0);

        console.log("Total amount:", totalAmount);

        const amountInCents = Math.round(totalAmount * 100);
        console.log("Amount in cents:", amountInCents);

        if (amountInCents > 0) {
            fetch('http://localhost:3000/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountInCents }),
            })
                .then(res => res.json())
                .then(data => setClientSecret(data.clientSecret));
        } else {
            console.warn("Amount is zero or invalid, skipping payment intent creation.");
        }
    }, [cartItems]);



    useEffect(() => {
        console.log("CurrentUser:", currentUser);

        if (isAuthenticated && currentUser) {
            setFormData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                city: currentUser.city || '',
                state: currentUser.state || '',
                postal_code: currentUser.postal_code || '',
                country: currentUser.country || ''
            })
        }
    }, [isAuthenticated, currentUser])

    const handleFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }    // Funzione per aggiornare il profilo utente con i dati del checkout
    const handleUpdateProfile = async () => {
        try {
            // Verifica quali campi aggiornare
            const profileData = {}

            // Aggiungi al profileData solo i campi che hanno un valore e che sono diversi da quelli dell'utente
            const fieldsToCheck = ['first_name', 'last_name', 'address', 'city', 'state', 'postal_code', 'country', 'phone']
            fieldsToCheck.forEach(field => {
                if (formData[field] && formData[field] !== currentUser[field]) {
                    profileData[field] = formData[field]
                }
            })

            // Se ci sono campi da aggiornare
            if (Object.keys(profileData).length > 0) {
                await updateProfile(profileData)
                setUpdateMessage('Dati profilo aggiornati con successo!')

                // Resetta il messaggio dopo 3 secondi
                setTimeout(() => {
                    setUpdateMessage('')
                }, 3000)
            } else {
                setUpdateMessage('Nessun dato da aggiornare')
                setTimeout(() => {
                    setUpdateMessage('')
                }, 3000)
            }
        } catch (error) {
            setUpdateMessage(`Errore durante l'aggiornamento: ${error.message}`)
            setTimeout(() => {
                setUpdateMessage('')
            }, 3000)
        }
    }
    console.log('Form status', formStatus);


    const itemsForOrder = cartItems.map(item => {
        return {
            "product_id": item.id,
            "product_variation_id": item.variations.id,
            "quantity": item.quantità
            // Removed price field for security
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault();


        const requiredFields = ['first_name', 'last_name', 'email', 'address', 'city', 'postal_code', 'country'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            setFormStatus({
                error: `I seguenti campi sono obbligatori: ${missingFields.join(', ')}`
            });
            return;
        }

        if (!stripe || !elements) {
            setFormStatus({ error: 'Stripe non è pronto' });
            return;
        }

        setIsLoading(true)
        const cardElement = elements.getElement(CardElement);
        const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: `${formData.first_name} ${formData.last_name}`,
                    email: formData.email,
                    address: {
                        line1: formData.address,
                        city: formData.city,
                        postal_code: formData.postal_code,
                        country: formData.country,
                    },
                },
            },
        });

        if (paymentResult.error) {
            setFormStatus({ error: paymentResult.error.message })
            setIsLoading(false)
            return;
        }

        if (paymentResult.paymentIntent.status === 'succeeded') {
            console.log('Pagamento riuscito');


            // continua con invio ordine come già fai
            const headers = {
                'Content-type': 'application/json',
                ...(isAuthenticated && {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                })
            };

            const customerInfo = {
                ...formData,
                ...(isAuthenticated
                    ? { user_id: currentUser?.id }
                    : {
                        password: Math.random().toString(36).slice(-8),
                        is_guest: true,
                    }),
            };

            fetch('http://localhost:3000/api/v1/orders', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    customer_info: customerInfo,
                    items: itemsForOrder,
                    discount: 0
                }),
            })
                .then(res => res.json())
                .then(data => {
                    setFormStatus(data);
                    setIsLoading(false)
                    if (!data.error) {
                        setCartItems([]);
                        localStorage.setItem('lastOrder', JSON.stringify({
                            order_id: data.order_id,
                            email: formData.email

                        }));
                        setIsLoading(false)
                    }
                })
                .catch(err => {
                    setFormStatus({ error: 'Errore durante la creazione dell’ordine.' });
                    if (isLoading) {
                        setIsLoading(false)
                    }
                });

        }
    };
    console.log('Loading', isLoading);

    // Funzione per calcolare il totale del carrello
    const calculateCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantità), 0).toFixed(2);
    }

    if (cartItems.length === 0 && !formStatus?.message) {
        return (
            <div className="checkout-container my-5 text-center">
                <h3>Il tuo carrello è vuoto</h3>
                <p>Aggiungi prodotti al carrello prima di procedere al checkout.</p>
                <Link to="/search" className="btn btn-primary">Continua lo shopping</Link>
            </div>
        )
    }// Carica il carrello da localStorage
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                if (parsedCart && Array.isArray(parsedCart) && parsedCart.length > 0) {
                    setCartSummary(parsedCart);
                    // Se cartItems è vuoto, carica anche lì i dati
                    if (cartItems.length === 0) {
                        setCartItems(parsedCart);
                    }
                }
            }
        } catch (error) {
            console.error('Errore nel caricare il carrello da localStorage:', error);
        }
    }, []);

    useEffect(() => {
        if (formStatus?.order_id) {
            const handleFormCheck = async () => {
                const response = await fetch(`http://localhost:3000/api/v1/orders/${formStatus.order_id}`)
                    .then(res => res.json())
                    .then(data => setFormCheck(data))


            }
            handleFormCheck()
        }
    }, [formStatus])
    return (
        <div className="checkout-container my-5">
            {/* Accordion Cart Summary */}
            <div className="cart-accordion mb-4">
                <div
                    className="accordion-header"
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <i className="fa-solid fa-shopping-cart me-2"></i>
                            Riepilogo ordine ({cartItems.length} articoli)
                        </h5>
                        <span className="accordion-toggle">
                            <i className={`fa-solid ${isAccordionOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                        </span>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <span>Totale:</span>
                        <strong>{calculateCartTotal()}€</strong>
                    </div>
                </div>

                <div className={`accordion-content ${isAccordionOpen ? 'open' : ''}`}>
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item-row">
                            <div className="cart-item-details">
                                <div className="cart-item-title">{item.name}</div>
                                <div className="cart-item-variant">
                                    <small>Colore: {item.variations.color}, Taglia: {item.variations.size}</small>
                                </div>
                            </div>
                            <div className="cart-item-price">
                                <div className="quantity">{item.quantità} x {item.price.toFixed(2)}€</div>
                                <div className="subtotal">{(item.price * item.quantità).toFixed(2)}€</div>
                            </div>
                        </div>
                    ))}

                    <div className="cart-summary-footer">
                        <div className="d-flex justify-content-between">
                            <span>Subtotale:</span>
                            <span>{calculateCartTotal()}€</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Spedizione:</span>
                            <span>Gratuita</span>
                        </div>
                        <div className="d-flex justify-content-between total-row">
                            <strong>Totale:</strong>
                            <strong>{calculateCartTotal()}€</strong>
                        </div>
                    </div>
                </div>
            </div>

            {!isAuthenticated && (
                <div className="mb-4 p-3 border rounded bg-light">
                    <p>Sei già registrato? <Link to="/login?redirect=checkout">Accedi</Link> per un checkout più veloce e per salvare i tuoi dati di spedizione.</p>
                </div>
            )}

            <form>
                <div className={`${!formStatus && !isLoading ? '' : 'd-none'}`}>
                    <h3 className="mb-4">Dati di spedizione</h3>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="first_name" className="form-label">Nome *</label>
                            <input
                                onChange={handleFormData}
                                type="text"
                                className="form-control"
                                name="first_name"
                                id="first_name"
                                aria-describedby="emailHelpId"
                                placeholder="Il tuo nome..."
                                value={formData.first_name || ''}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="last_name" className="form-label">Cognome *</label>
                            <input
                                onChange={handleFormData}
                                type="text"
                                className="form-control"
                                name="last_name"
                                id="last_name"
                                aria-describedby="emailHelpId"
                                placeholder="Il tuo cognome..."
                                value={formData.last_name || ''}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Dati di pagamento</label>
                        <div className="p-3 border rounded bg-white">
                            <CardElement options={{ hidePostalCode: true }} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email *</label>
                        <input
                            onChange={handleFormData}
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            aria-describedby="emailHelpId"
                            placeholder="example@email.com"
                            value={formData.email || ''}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Indirizzo *</label>
                        <input
                            onChange={handleFormData}
                            type="text"
                            className="form-control"
                            name="address"
                            id="address"
                            aria-describedby="emailHelpId"
                            placeholder="Il tuo indirizzo..."
                            value={formData.address || ''}
                            required
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="postal_code" className="form-label">CAP *</label>
                            <input
                                onChange={handleFormData}
                                type="text"
                                className="form-control"
                                name="postal_code"
                                id="postal_code"
                                aria-describedby="emailHelpId"
                                placeholder="CAP"
                                value={formData.postal_code || ''}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="phone" className="form-label">Telefono</label>
                            <input
                                onChange={handleFormData}
                                type="tel"
                                className="form-control"
                                name="phone"
                                id="phone"
                                aria-describedby="emailHelpId"
                                placeholder="+39 333 3333333"
                                value={formData.phone || ''}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="country" className="form-label">Paese *</label>
                            <select
                                onChange={handleFormData}
                                className="form-select"
                                name="country"
                                id="country"
                                value={formData.country || ''}
                                required
                            >
                                <option value="" disabled>Scegli il tuo paese</option>
                                <option value="IT">IT</option>
                                <option value="DE">DE</option>
                                <option value="FR">FR</option>
                                <option value="ES">ES</option>
                                <option value="GB">GB</option>
                                <option value="US">US</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="city" className="form-label">Città *</label>
                            <input
                                onChange={handleFormData}
                                type="text"
                                className="form-control"
                                name="city"
                                id="city"
                                aria-describedby="emailHelpId"
                                placeholder="La tua città..."
                                value={formData.city || ''}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="state" className="form-label">Provincia</label>
                        <input
                            onChange={handleFormData}
                            type="text"
                            className="form-control"
                            name="state"
                            id="state"
                            aria-describedby="emailHelpId"
                            placeholder="La tua provincia..."
                            value={formData.state || ''}
                        />
                    </div>

                    {isAuthenticated && (
                        <div className="mt-3 mb-4 text-center">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={handleUpdateProfile}
                            >
                                <i className="fa-solid fa-user me-2"></i>
                                Salva questi dati nel tuo profilo
                            </button>
                            {updateMessage && (
                                <div className="alert mt-2 p-2 alert-success">
                                    {updateMessage}
                                </div>
                            )}
                        </div>
                    )}

                    <div className='w-100 d-flex justify-content-between'>
                        <Link to="/carello" className="btn btn-outline-secondary">
                            <i className="fa-solid fa-arrow-left me-2"></i>
                            Torna al carrello
                        </Link>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className='form-button'
                            type="submit"
                        >
                            Conferma ordine
                            <div className='icon-button'>
                                <i className='fa-solid fa-arrow-right'></i>
                            </div>
                        </button>
                    </div>
                </div>
                {formStatus ? (
                    <div className={`${formStatus.error ? 'bg-danger' : 'bg-success'}  m-auto p-5 text-center text-white h5 position-relative`}>
                        {formStatus.error ? (
                            <>
                                <div onClick={() => setFormStatus(null)} className="position-absolute start-0 top-0 p-3 text-white">
                                    <i className='fa-solid fa-arrow-left'></i>
                                </div>
                                <p className="h4">{formStatus.error}</p>
                            </>
                        ) : (
                            <>

                                <div>

                                    <i className="fa-solid fa-check-circle fs-1 mb-3"></i>
                                    <p className='h4'>{formStatus.message}</p>
                                    {formCheck?.id && (
                                        <div className="text-start mt-5 bg-white text-dark rounded-2 p-4">
                                            <h5 className="mb-3">🧾 Riepilogo Ordine #{formCheck.numeric_id}</h5>
                                            <p><strong>Nome:</strong> {formCheck.first_name} {formCheck.last_name}</p>
                                            <p><strong>Email:</strong> {formCheck.email}</p>
                                            <p><strong>Telefono:</strong> {formCheck.phone}</p>
                                            <p><strong>Indirizzo:</strong> {formCheck.address}, {formCheck.postal_code}, {formCheck.city}, {formCheck.state}, {formCheck.country}</p>
                                            <hr />
                                            <h6 className="mt-3 mb-2">📦 Prodotti</h6>
                                            <ul className="list-unstyled">
                                                {formCheck.items.map((item, index) => (
                                                    <li key={index} className="mb-2">
                                                        <strong>{item.product_name}</strong> - {item.quantity} × {item.price}€ <br />
                                                        <small>Variante: {item.color}, Taglia: {item.size}</small>
                                                    </li>
                                                ))}
                                            </ul>
                                            <hr />
                                            <p><strong>Totale:</strong> {formCheck.total}€</p>
                                            {parseFloat(formCheck.discount) > 0 && (
                                                <p><strong>Sconto:</strong> {formCheck.discount}€</p>
                                            )}
                                            <p><strong>Stato ordine:</strong> {formCheck.status}</p>
                                        </div>
                                    )}
                                </div>

                            </>
                        )}
                    </div>
                ) : isLoading ? (
                    <div className="loader-container">
                        <div className="spinner "></div>
                        <p className='text-center d-block'>Stiamo processando il tuo ordine...</p>
                    </div>

                ) : (
                    <>
                    </>
                )}
            </form>
        </div>
    )


}

export default Checkout
