export default function Contacts() {
    return (
        <div className="main-container">
            <section className="container py-5">
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {/* Titolo */}
                    <h2 className="text-center fw-semibold display-6 mb-3">Contattaci</h2>

                    {/* Sottotitolo */}
                    <p className="text-center fst-italic text-white mb-4">
                        Per informazioni, collaborazioni o assistenza, il nostro team è a tua disposizione.
                    </p>

                    {/* Divider */}
                    <hr style={{ width: '60px', borderTop: '2px solid #fff', margin: 'auto' }} className="mb-5" />

                    {/* Contatti */}
                    <div className="text-light lh-lg fs-6 text-center">
                        <p>
                            <strong>Email:</strong> <a href="mailto:info@boolean.com" className="text-decoration-underline text-light">info@boolean.com</a><br />
                            <strong>Telefono:</strong> +39 345 678 9012<br />
                            <strong>Indirizzo:</strong> Via della Moda 12, 20100 Milano, Italia
                        </p>
                    </div>

                    {/* Social */}
                    <div className="text-center mt-4">
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
            </section>

        </div>
    )
}