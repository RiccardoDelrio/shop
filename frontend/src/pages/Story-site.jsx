export default function StorySite() {
    return (
        <div className="main-container">
            {/* Content goes here */}
            <div className="container py-5 text-black">
                {/* Title and subtitle */}
                <h2 className="text-center fw-bold display-5 mb-3">Our Story</h2>
                <p className="text-center fst-italic text-black mb-4">
                    Essential elegance, artisanal roots, contemporary vision.
                </p>

                {/* Divider */}
                <hr className=" line-story mb-5" />

                {/* Central block with light background */}
                <div className="block-text text-black p-5 rounded-3" >
                    <p>
                        <strong>Boolique</strong> was born from the ambition to reinterpret contemporary elegance with an essential vision,
                        attention to detail, and deeply rooted in the value of craftsmanship.
                    </p>
                    <p>
                        Founded by a team of creatives and artisans with experience in the fashion world, the brand aims to combine
                        tailoring quality, stylistic research, and material awareness to offer garments that last over time, respecting
                        the body and personal style of those who wear them.
                    </p>
                    <p>
                        Each collection is the result of careful design and limited production, because for us, luxury is made of
                        thoughtful choices, not quantity. We believe that authenticity and simplicity are today the true symbols of refinement.
                    </p>
                    <p>
                        <strong>Boolique</strong> is a space for those seeking more than just a garment: a visual identity that reflects
                        deep values, with coherence and discretion.
                    </p>
                </div>

                {/* Final quote */}
                <blockquote className="fst-italic text-center mt-5 text-black">
                    "Elegance is not about being noticed, but about being remembered."
                    <br />
                    <small>— Giorgio Armani</small>
                </blockquote>
            </div>
        </div>
    );
}
