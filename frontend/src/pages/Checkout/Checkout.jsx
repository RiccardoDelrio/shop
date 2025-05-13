import React, { useState } from 'react'
import './checkout.css'
const Checkout = () => {
    const [formData, setFormData] = useState('')
    const handleFormData = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    console.log('Form data', formData);

    return (
        <div className="checkout-container my-5">
            <div className='mb-3'>

                <label htmlFor="name" className="form-label">Name</label>
                <input
                    onChange={(e) => handleFormData(e)}
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    aria-describedby="emailHelpId"
                    placeholder="Your name..."
                />
            </div>
            <div className='mb-3'>

                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                    onChange={(e) => handleFormData(e)}
                    type="text"
                    className="form-control"
                    name="lastName"
                    id="lastName"
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

                <label htmlFor="cap" className="form-label">C.A.P.</label>
                <input
                    onChange={(e) => handleFormData(e)}
                    type="number"
                    className="form-control"
                    name="cap"
                    id="cap"
                    aria-describedby="emailHelpId"
                    placeholder="C.A.P."
                />
            </div>
            <div className='mb-3'>

                <label htmlFor="email" className="form-label">Phone number</label>
                <input
                    onChange={(e) => handleFormData(e)}
                    type="number"
                    className="form-control"
                    name=""
                    id=""
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
                    name=""
                    id=""
                    aria-describedby="emailHelpId"
                    placeholder="example@email.com"
                />
            </div>
            <div className='w-100 d-flex justify-content-end'>

                <button className='form-button' type="submit">Invia <div className='icon-button'><i className='fa-solid fa-arrow-right'></i></div></button>
            </div>


        </div>

    )
}

export default Checkout
