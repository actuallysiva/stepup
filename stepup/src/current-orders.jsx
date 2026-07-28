export default function CurrentOrders({closePopup}) {

    return(

        <div className="overlay">

            <div className="currentOrdersCard">

                {/* HEADER */}

                <div className="popupHeader">

                    <h2>Current Orders</h2>

                    <button
                        className="closeBtn"
                        onClick={closePopup}
                    >
                        ✕
                    </button>

                </div>

                {/* ORDER CARD */}

                <div className="orderItem">

                    <div className="orderImage">

                        <img
                            src=""
                            alt="shoe"
                        />

                    </div>

                    <div className="orderDetails">

                        <h3>Running Shoe</h3>

                        <p>Quantity : 2</p>

                        <p>Buyer : Rahul</p>

                        <p>Mobile : 9876543210</p>

                        <p>
                            Address :
                            12, Gandhi Street,
                            Chennai
                        </p>

                        <p>Payment : COD</p>

                        <p>Status : Pending</p>

                        <p>Total : ₹ 1800</p>

                    </div>

                </div>

                {/* SECOND ORDER */}

                <div className="orderItem">

                    <div className="orderImage">

                        <img
                            src=""
                            alt="shoe"
                        />

                    </div>

                    <div className="orderDetails">

                        <h3>Sports Shoe</h3>

                        <p>Quantity : 1</p>

                        <p>Buyer : Arjun</p>

                        <p>Mobile : 9999999999</p>

                        <p>
                            Address :
                            Anna Nagar,
                            Chennai
                        </p>

                        <p>Payment : UPI</p>

                        <p>Status : Packed</p>

                        <p>Total : ₹ 1200</p>

                    </div>

                </div>

            </div>

        </div>

    );
}