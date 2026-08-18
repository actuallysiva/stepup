import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './step-component.jsx';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';
import  successIcon  from './assets/success.png'

import "./styles/success.css";


export default function Success() {
  const navigate = useNavigate();
  const { lastOrder } = useApp();

  return (
    <div className="checkoutLayout">
      <CheckoutSteps step={4} />
      <div className="checkoutContent">
        <div className="successContainer">
          <div className="greetings">

    <div className="imageContainer">
        <img src={successIcon} alt="Order Successful" />
    </div>

    <h2>Order Confirmed!</h2>

    <p className="successSubtitle">
        Thank you for shopping with StepUP.
        <br />
        Your order has been placed successfully.
    </p>

    <div className="successSummary">

        <div className="summaryRow">
            <span>Order ID</span>
            <strong>{lastOrder?.order_id || "—"}</strong>
        </div>

        <div className="summaryRow">
            <span>Total Paid</span>
            <strong>{formatPrice(lastOrder?.totalamount || 0)}</strong>
        </div>

        <div className="summaryRow">
            <span>Payment</span>
            <strong>{lastOrder?.payment_method || "Razorpay"}</strong>
        </div>

        <div className="summaryRow">
            <span>Estimated Delivery</span>
            <strong>2–5 Business Days</strong>
        </div>

    </div>

    <div className="successButtons">

        <button
            className="primaryBtn"
            onClick={() => navigate("/")}
        >
            Continue Shopping
        </button>

        <button
            className="secondaryBtn"
            onClick={() => navigate("/userProfile")}
        >
            View Orders
        </button>

    </div>

</div>
        </div>
      </div>
    </div>
  );
}
