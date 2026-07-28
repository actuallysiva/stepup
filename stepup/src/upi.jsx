export default function UPI() {

    return(

        <div className="upiPage">

            <div className="upiCard">

                <div className="titleContainer">

                    <h1>Pay via UPI</h1>

                    <p>
                        Complete your payment to place the order
                    </p>

                </div>

                <div className="paymentSummary">

                    <h3>Order Total</h3>

                    <h2>₹ 1800</h2>

                </div>

                <div className="qrContainer">

                    <div className="codeContainer">

                        <img
                            src=""
                            alt="QR Code"
                        />

                    </div>

                    <div className="detailsQr">

                        <h3>Scan QR Code</h3>

                        <p>
                            Open any UPI application and scan
                            the QR code to make payment.
                        </p>

                        <p>
                            UPI ID :
                            stepup@upi
                        </p>

                        <p className="paymentInfo">
                            Payment will be verified before
                            order confirmation.
                        </p>

                    </div>

                </div>

                <div className="paymentActions">

                    <button>
                        I Have Paid
                    </button>

                    <button className="secondaryBtn">
                        Back
                    </button>

                </div>

            </div>

        </div>

    );
}