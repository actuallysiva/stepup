
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./step-component.jsx";

export default function Confirmation(){
    const navigate = useNavigate();
    return(

        <div className="checkoutLayout">

            <CheckoutSteps step={3}/>

            <div className="checkoutContent">

                <div className="confirmationPage">

            <div className="confirmationCard">

                <div className="titleConfirmation">

                    <h2>Order Confirmation</h2>

                    <p>
                        Please verify all details before
                        placing your order.
                    </p>

                </div>

                {/* PRODUCT DETAILS */}

                <div className="detailsPurchase">

                    <h3>Product Details</h3>

                    <div className="detailsProduct">

                        <img
                            src=""
                            alt="Product"
                        />

                        <div>

                            <h4>Name : Running Shoe</h4>

                            <h4>Category : Men</h4>

                            <h4>Size : 9</h4>

                            <h4>Color : White</h4>

                            <h4>Quantity : 2</h4>

                            <h4>Price : ₹ 1800</h4>

                        </div>

                    </div>

                </div>

                {/* USER DETAILS */}

                <div className="detailsUser">

                    <h3>Delivery Details</h3>

                    <h4>Name : Siva Kumar</h4>

                    <h4>Mobile : 9876543210</h4>

                    <h4>
                        Address :
                        12 Gandhi Street,
                        Chennai - 600001
                    </h4>

                    <h4>Payment Mode : UPI</h4>

                </div>

                {/* ORDER SUMMARY */}

                <div className="orderSummary">

                    <h3>Order Summary</h3>

                    <h4>Product Total : ₹ 1800</h4>

                    <h4>Shipping : Free</h4>

                    <h4>Estimated Delivery : Saturday</h4>

                    <h2>Total : ₹ 1800</h2>

                </div>

                {/* ACTIONS */}

                <div className="confirmOrder">

                    <button onClick={()=>navigate('/success/')}>
                        Confirm Order
                    </button>

                    <a href="">
                        Cancel Order
                    </a>

                </div>

            </div>

        </div>

            </div>

        </div>

    );
}