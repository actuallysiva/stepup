import { useNavigate } from "react-router-dom";

export default function Cart() {
    const navigate = useNavigate();
    return (
        <div className="cartContainer">

            <div className="topContainer">
                <h1>Shopping Cart</h1>
                <button className="continueShoppingBtn" onClick={()=>navigate('/')}>
                    Continue Shopping
                </button>
            </div>

            <div className="cartContent">

                <div className="middleContainer">

                    <div className="cartItem">

                        <img
                            src="https://via.placeholder.com/120"
                            alt="Product"
                        />

                        <div className="itemDetails">
                            <h3>Nike Air Max</h3>
                            <p>Size: 9</p>
                            <p>Price: ₹4,999</p>

                            <div className="quantityContainer">
                                <button>-</button>
                                <span>1</span>
                                <button>+</button>
                            </div>
                        </div>

                        <button className="removeBtn">
                            Remove
                        </button>

                    </div>

                </div>

                <div className="bottomContainer">

                    <h2>Order Summary</h2>

                    <div className="billRow">
                        <span>Subtotal</span>
                        <span>₹4,999</span>
                    </div>

                    <div className="billRow">
                        <span>Delivery</span>
                        <span>₹99</span>
                    </div>

                    <div className="billRow totalRow">
                        <span>Total</span>
                        <span>₹5,098</span>
                    </div>

                    <button className="checkoutBtn" onClick={()=>navigate('/verification')}>
                        Checkout
                    </button>

                </div>

            </div>

        </div>
    );
}