import './footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { NavLink } from 'react-router';

export default function Footer() {
    return (
        <>

            <footer className="">
                <div className="main-container">
                    <hr />
                    <div className="row justify-content-between align-items-center mb-3">
                        {/* Contenitore per le due sezioni di sinistra */}
                        <div className="col-12  col-md-5 mb-4  ">
                            <div className="row">
                                {/* Prima sezione */}
                                <div className="col-6">
                                    <h5 className="text-center">Information</h5>
                                    <ul className="nav flex-column text-center info-list">
                                        <li className="nav-item mb-2">
                                            < NavLink to="/" className="nav-link p-0 ">About us</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/" className="nav-link p-0 ">Privacy & Policy</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/" className="nav-link p-0 ">Contact Us</NavLink>
                                        </li>
                                    </ul>
                                </div>

                                {/* Seconda sezione */}
                                <div className="col-6 ">
                                    <h5 className="text-center">Products</h5>
                                    <ul className="nav flex-column text-center info-list">
                                        <li className="nav-item mb-2">

                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/" className="nav-link p-0 ">Discount</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/" className="nav-link p-0 ">Catalog</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/" className="nav-link p-0 ">Size Table</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contenitore per il quadrato sulla destra */}
                        <div className="col-12  col-md-7 d-flex  justify-content-center justify-content-md-end">
                            <div className="info-box p-4 border rounded text-center">
                                <h5>Contact Us</h5>
                                <p className="mb-1"><strong>Phone:</strong> +394567890</p>
                                <p className="mb-1"><strong>Email:</strong> info@Boolean.com</p>
                                <p className="mb-1"><strong>P.IVA:</strong> IT12345678901</p>
                                <div className="social-links mt-3">
                                    <a href="#" className="me-3 facebook">
                                        <i className="fab fa-facebook fa-lg"></i>
                                    </a>
                                    <a href="#" className="me-3 twitter">
                                        <i className="fab fa-twitter fa-lg"></i>
                                    </a>
                                    <a href="#" className="instagram">
                                        <i className="fab fa-instagram fa-lg"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    );
}