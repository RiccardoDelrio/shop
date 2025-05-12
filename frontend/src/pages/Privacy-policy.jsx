export default function PrivacyPolicy() {
    return (
        <div className="main-container">
            <section className="container py-5">
                <div className="policy" >
                    {/* Titolo */}
                    <h2 className="text-center fw-semibold display-6 mb-3">Privacy Policy</h2>
                    <p className="text-center fst-italic text-white mb-4">
                        Transparency is part of our elegance. The following policy describes how we handle your data with respect and responsibility.
                    </p>

                    {/* Paragrafi */}
                    <div className="lh-lg fs-6 text-light">
                        <h5 className="mt-5 fw-bold">1. Introduzione</h5>
                        <p>
                            Boolean si impegna a tutelare la privacy dei propri utenti nel rispetto del Regolamento (UE) 2016/679 (“GDPR”).
                            I dati personali vengono trattati con attenzione, riservatezza e solo per finalità specifiche e legittime.
                        </p>

                        <h5 className="mt-4 fw-bold">2. Titolare del trattamento</h5>
                        <p>
                            Il titolare del trattamento è Boolean S.r.l., con sede legale in Via della Moda 12, Milano. Puoi contattarci all’indirizzo
                            <a href="mailto:privacy@boolean.com" className="text-decoration-underline text-light"> privacy@boolean.com</a>.
                        </p>

                        <h5 className="mt-4 fw-bold">3. Quali dati raccogliamo</h5>
                        <ul>
                            <li>Dati identificativi (nome, cognome, email, numero di telefono)</li>
                            <li>Dati necessari alla spedizione e alla fatturazione</li>
                            <li>Dati di navigazione raccolti tramite cookie tecnici e analitici</li>
                        </ul>

                        <h5 className="mt-4 fw-bold">4. Finalità del trattamento</h5>
                        <p>I tuoi dati vengono trattati per:</p>
                        <ul>
                            <li>Gestire gli ordini e le consegne</li>
                            <li>Offrire assistenza e supporto</li>
                            <li>Inviare aggiornamenti e comunicazioni promozionali (solo previo consenso)</li>
                            <li>Analizzare in forma aggregata l’uso del sito per migliorarne la qualità</li>
                        </ul>

                        <h5 className="mt-4 fw-bold">5. Conservazione</h5>
                        <p>
                            I dati personali sono conservati solo per il tempo necessario a garantire il servizio o adempiere agli obblighi di legge.
                            I dati per finalità promozionali sono conservati fino a revoca del consenso.
                        </p>

                        <h5 className="mt-4 fw-bold">6. I tuoi diritti</h5>
                        <p>
                            Puoi richiedere in qualsiasi momento: accesso, rettifica, cancellazione, opposizione o limitazione del trattamento.
                            Hai inoltre diritto alla portabilità dei dati. Le richieste vanno inviate a <a href="mailto:privacy@boolean.com" className="text-decoration-underline text-light">privacy@boolean.com</a>.
                        </p>

                        <h5 className="mt-4 fw-bold">7. Minori</h5>
                        <p>
                            I nostri servizi non sono destinati a utenti di età inferiore ai 16 anni e non raccogliamo intenzionalmente dati da minori.
                        </p>
                    </div>
                </div>
            </section>

        </div>
    );
}