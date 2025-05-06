import './footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function Footer() {
    return (
        <>
            <footer className="">
                <div className="main-container">
                    <div className="row justify-content-between align-items-center">
                        {/* Contenitore per le due sezioni di sinistra */}
                        <div className="col-12  col-md-5 mb-4  ">
                            <div className="row">
                                {/* Prima sezione */}
                                <div className="col-6">
                                    <h5 className="text-center">Information</h5>
                                    <ul className="nav flex-column text-center">
                                        <li className="nav-item mb-2">
                                            <a className="nav-link p-0 text-muted" href="#">Home</a>
                                        </li>
                                        <li className="nav-item mb-2">
                                            <a className="nav-link p-0 text-muted" href="#">About</a>
                                        </li>
                                        <li className="nav-item mb-2">
                                            <a className="nav-link p-0 text-muted" href="#">Services</a>
                                        </li>
                                    </ul>
                                </div>

                                {/* Seconda sezione */}
                                <div className="col-6 ">
                                    <h5 className="text-center">Products</h5>
                                    <ul className="nav flex-column">
                                        <li className="nav-item mb-2">
                                            <a className="nav-link p-0 text-muted" href="#">Contact</a>
                                        </li>
                                        <li className="nav-item mb-2">
                                            <a className="nav-link p-0 text-muted" href="#">Blog</a>
                                        </li>
                                        <li className="nav-item mb-2">
                                            <a className="nav-link p-0 text-muted" href="#">FAQ</a>
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