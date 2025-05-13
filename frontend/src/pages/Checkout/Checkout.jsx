import React, { useState } from 'react'
import './checkout.css'
import { useGlobal } from '../../contexts/GlobalContext'
const Checkout = () => {
    const { cartItems, setCartItems } = useGlobal()
    const [formData, setFormData] = useState('')
    const [formStatus, setFormStatus] = useState(null)
    const handleFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    console.log('Form data', formData);

    const itmesForOrder = cartItems.map(item => {
        return {
            "product_id": item.id,
            "product_variation_id": item.variations.id,
            "quantity": item.quantità,
            "price": item.price
        }
    })
    console.log(itmesForOrder, 'itemsForOrder');

    console.log(cartItems);



    const handleSubmit = async (e) => {
        e.preventDefault()
        fetch('http://localhost:3000/api/v1/orders', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ "customer_info": { ...formData }, "items": itmesForOrder, "discount": 0 })
        })
            .then(res => res.json())
            .then(data => {
                setFormStatus(data);
                if (!data.error) {

                    setCartItems([])
                }

            })



    }
    console.log(formStatus);



    /* {
        "customer_info": {
          "first_name": "Mario",
          "last_name": "Rossi",
          "email": "customer@example.com",
          "phone": "123456789",
          "address": "Via Roma 1",
          "city": "Milano",
          "state": "MI",
          "postal_code": "20100",
          "country": "Italy"
        },
        "items": [
          {
            "product_id": 5,
            "product_variation_id": 12,
            "quantity": 2,
            "price": 100
          }
        ],
        "discount": 10
      } */

    return (
        <form className="checkout-container my-5">
            {formStatus ? (
                <div className={`${formStatus.error ? 'bg-danger' : 'bg-success'} rounded-4 m-auto p-5 text-center h5 position-relative`}>
                    {formStatus.error ? (
                        <>
                            <div onClick={() => setFormStatus()} className="position-absolute start-0 top-0 p-3 text-white"><i className='fa-solid fa-arrow-left'></i></div>
                            <p className="h4">{formStatus.error}</p>
                        </>
                    ) : (
                        <p className='h4'>{formStatus.message}</p>
                    )}

                </div>
            ) : (<>
                <div className='mb-3'>

                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input
                        onChange={(e) => handleFormData(e)}
                        type="text"
                        className="form-control"
                        name="first_name"
                        id="first_name"
                        aria-describedby="emailHelpId"
                        placeholder="Your name..."
                    />
                </div>
                <div className='mb-3'>

                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input
                        onChange={(e) => handleFormData(e)}
                        type="text"
                        className="form-control"
                        name="last_name"
                        id="last_name"
                        aria-describedby="emailHelpId"
                        placeholder="Your last name..."
                    />
                </div>
                <div className='mb-3'>

                    <label htmlFor="address" className="form-label">Address</label>
                    <input
                        onChange={(e) => handleFormData(e)}
                        type="text"
                        className="form-control"
                        name="address"
                        id="address"
                        aria-describedby="emailHelpId"
                        placeholder="Your address..."
                    />
                </div>
                <div className='mb-3'>

                    <label htmlFor="postal_code" className="form-label">C.A.P.</label>
                    <input
                        onChange={(e) => { setFormData({ ...formData, [e.target.name]: Number(e.target.value) }) }}
                        type="text"


                        className="form-control"
                        name="postal_code"
                        id="postal_code"
                        aria-describedby="emailHelpId"
                        placeholder="C.A.P."
                        value={formData.postal_code || ''}

                    />
                </div>
                <div className='mb-3'>

                    <label htmlFor="phone" className="form-label">Phone number</label>
                    <input
                        onChange={(e) => handleFormData(e)}
                        type="number"
                        className="form-control"
                        name="phone"
                        id="phone"
                        aria-describedby="emailHelpId"
                        placeholder="+39 333 3333333"
                    />
                </div>
                <div className='mb-3'>

                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        onChange={(e) => handleFormData(e)}
                        type="email"
                        className="form-control"
                        name="email"
                        id="email"
                        aria-describedby="emailHelpId"
                        placeholder="example@email.com"
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="country" className="form-label">Country</label>
                    <select
                        onChange={handleFormData}
                        className="form-select"
                        name="country"
                        id="country"
                        defaultValue=""
                    >
                        <option value="" disabled>Choose your country</option>
                        <option value="Italy">Italy</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Spain">Spain</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                    </select>
                </div>
                <div className='mb-3'>

                    <label htmlFor="city" className="form-label">City</label>
                    <input
                        onChange={(e) => handleFormData(e)}
                        type="text"
                        className="form-control"
                        name="city"
                        id="city"
                        aria-describedby="emailHelpId"
                        placeholder="Where are you from..."
                    />
                </div>
                <div className='mb-3'>

                    <label htmlFor="state" className="form-label">State</label>
                    <input
                        onChange={(e) => handleFormData(e)}
                        type="text"
                        className="form-control"
                        name="state"
                        id="state"
                        aria-describedby="emailHelpId"
                        placeholder="Your state..."
                    />
                </div>

                <div className='w-100 d-flex justify-content-end'>

                    <button onClick={handleSubmit} className='form-button' type="submit">Invia <div className='icon-button'><i className='fa-solid fa-arrow-right'></i></div></button>
                </div></>)}



        </form>

    )
}

export default Checkout
