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
                                    <h5 className="text-center">Informazioni</h5>
                                    <ul className="nav flex-column text-center info-list">
                                        <li className="nav-item mb-2">
                                            < NavLink to="/story-site" className="nav-link p-0 footer-nav-link ">La nostra storia</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/privacy-policy" className="nav-link p-0 footer-nav-link ">Privacy & Policy</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/contacts" className="nav-link p-0 footer-nav-link ">Contataci</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/unsubscribe-newsletter" className="nav-link p-0 footer-nav-link ">Disiscrizione Newsletter</NavLink>
                                        </li>
                                    </ul>
                                </div>

                                {/* Seconda sezione */}
                                <div className="col-6 ">
                                    <h5 className="text-center">Prodotti</h5>
                                    <ul className="nav flex-column text-center info-list">
                                        <li className="nav-item mb-2">
                                            < NavLink to="/" className="nav-link p-0 footer-nav-link ">Sconti</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/catalogo" className="nav-link p-0 footer-nav-link ">Catalogo</NavLink>
                                        </li>
                                        <li className="nav-item mb-2">
                                            < NavLink to="/size-table" className="nav-link p-0 footer-nav-link ">Guida alle taglie</NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Contenitore per il quadrato sulla destra */}
                        <div className="col-12  col-md-7 d-flex  justify-content-center justify-content-md-end">
                            <div className="info-box p-4 border rounded text-center">
                                <h5>Contattaci</h5>
                                <p className="mb-1"><strong>Telefono:</strong>+39 345 678 9012</p>
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
