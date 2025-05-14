import React, { useState, useEffect } from 'react'
import './checkout.css'
import { useGlobal } from '../../contexts/GlobalContext'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

const Checkout = () => {
    const { cartItems, setCartItems } = useGlobal()
    const { currentUser, updateProfile } = useAuth()
    const isAuthenticated = !!currentUser
    const [formData, setFormData] = useState({})
    const [formStatus, setFormStatus] = useState(null)
    const [updateMessage, setUpdateMessage] = useState('')    // Precompila i dati del form con le informazioni dell'utente loggato
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

    const itemsForOrder = cartItems.map(item => {
        return {
            "product_id": item.id,
            "product_variation_id": item.variations.id,
            "quantity": item.quantità,
            "price": item.price
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validazione dei campi obbligatori
        const requiredFields = ['first_name', 'last_name', 'email', 'address', 'city', 'postal_code', 'country']
        const missingFields = requiredFields.filter(field => !formData[field])

        if (missingFields.length > 0) {
            setFormStatus({
                error: `I seguenti campi sono obbligatori: ${missingFields.join(', ')}`
            })
            return
        }

        // Preparazione degli headers e dati
        const headers = {
            'Content-type': 'application/json'
        }

        // Se l'utente è loggato, aggiungi il token di autenticazione
        if (isAuthenticated) {
            headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        }

        // Preparazione dei dati del cliente
        const customerInfo = { ...formData }

        // Per utenti guest, aggiungi una password temporanea generata casualmente
        if (!isAuthenticated) {
            // Crea una password casuale per utenti guest
            const temporaryPassword = Math.random().toString(36).slice(-8)
            customerInfo.password = temporaryPassword
            // Aggiungi un flag per indicare che è un utente guest
            customerInfo.is_guest = true
        } else {        // Per utenti autenticati, aggiungiamo l'ID utente se disponibile
            if (currentUser && currentUser.id) {
                customerInfo.user_id = currentUser.id
            }
        }

        fetch('http://localhost:3000/api/v1/orders', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                "customer_info": customerInfo,
                "items": itemsForOrder,
                "discount": 0
            })
        })
            .then(res => res.json())
            .then(data => {
                setFormStatus(data);
                if (!data.error) {
                    setCartItems([])
                    // Salva anche l'ordine in localStorage per permettere successivo tracking
                    localStorage.setItem('lastOrder', JSON.stringify({
                        order_id: data.order_id,
                        email: formData.email
                    }))
                }
            })
            .catch(err => {
                console.error("Errore durante l'invio dell'ordine:", err);
                setFormStatus({
                    error: "Si è verificato un errore durante l'invio dell'ordine"
                })
            })
    }

    if (cartItems.length === 0 && !formStatus?.message) {
        return (
            <div className="checkout-container my-5 text-center">
                <h3>Il tuo carrello è vuoto</h3>
                <p>Aggiungi prodotti al carrello prima di procedere al checkout.</p>
                <Link to="/search" className="btn btn-primary">Continua lo shopping</Link>
            </div>
        )
    }

    return (
        <div className="checkout-container my-5">
            {!isAuthenticated && (
                <div className="mb-4 p-3 border rounded bg-light">
                    <p>Sei già registrato? <Link to="/login?redirect=checkout">Accedi</Link> per un checkout più veloce e per salvare i tuoi dati di spedizione.</p>
                </div>
            )}

            <form>
                {formStatus ? (
                    <div className={`${formStatus.error ? 'bg-danger' : 'bg-success'} rounded-4 m-auto p-5 text-center h5 position-relative`}>
                        {formStatus.error ? (
                            <>
                                <div onClick={() => setFormStatus(null)} className="position-absolute start-0 top-0 p-3 text-white">
                                    <i className='fa-solid fa-arrow-left'></i>
                                </div>
                                <p className="h4">{formStatus.error}</p>
                            </>
                        ) : (
                            <>
                                <p className='h4'>{formStatus.message}</p>
                                <p>Il tuo ordine #{formStatus.order_id} è stato creato con successo!</p>
                                <p>Riceverai una email di conferma all'indirizzo: {formData.email}</p>
                                <div className="mt-3">
                                    <Link to="/" className="btn btn-light me-2">Torna alla Home</Link>
                                    <Link to="/search" className="btn btn-outline-light">Continua lo shopping</Link>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <>
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
                                    <option value="Italy">Italia</option>
                                    <option value="Germany">Germania</option>
                                    <option value="France">Francia</option>
                                    <option value="Spain">Spagna</option>
                                    <option value="United Kingdom">Regno Unito</option>
                                    <option value="United States">Stati Uniti</option>
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
                                className='form-button'
                                type="submit"
                            >
                                Conferma ordine
                                <div className='icon-button'>
                                    <i className='fa-solid fa-arrow-right'></i>
                                </div>
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}

export default Checkout