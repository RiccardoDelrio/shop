export default function StorySite() {
    return (
        <div className="main-container">
            <div className="container py-5 text-light">
                {/* Titolo e sottotitolo */}
                <h2 className="text-center fw-bold display-5 mb-3">La nostra storia</h2>
                <p className="text-center fst-italic text-white mb-4">
                    Eleganza essenziale, radici artigianali, visione contemporanea.
                </p>

                {/* Divider */}
                <hr className=" line-story mb-5" />

                {/* Blocco centrale con sfondo chiaro */}
                <div className="block-text text-white p-5 rounded-3" >
                    <p>
                        <strong>Boolean</strong> nasce dall’ambizione di reinterpretare l’eleganza contemporanea con una visione
                        essenziale, curata nei dettagli e profondamente radicata nel valore dell’artigianalità.
                    </p>
                    <p>
                        Fondato da un team di creativi e artigiani con esperienze nel mondo della moda, il brand si propone di
                        unire qualità sartoriale, ricerca stilistica e consapevolezza dei materiali, per offrire capi che durino
                        nel tempo, nel rispetto del corpo e dello stile personale di chi li indossa.
                    </p>
                    <p>
                        Ogni collezione è il frutto di una progettazione attenta e di una produzione limitata, perché per noi il
                        lusso è fatto di scelte ponderate, non di quantità. Crediamo che l’autenticità e l’essenzialità siano oggi
                        i veri simboli di raffinatezza.
                    </p>
                    <p>
                        <strong>Boolean</strong> è uno spazio per chi cerca più di un capo: un'identità visiva che rispecchi valori
                        profondi, con coerenza e discrezione.
                    </p>
                </div>

                {/* Citazione finale */}
                <blockquote className="fst-italic text-center mt-5 text-white">
                    "L’eleganza non è farsi notare, ma farsi ricordare."
                    <br />
                    <small>— Giorgio Armani</small>
                </blockquote>
            </div>

        </div>
    )
}