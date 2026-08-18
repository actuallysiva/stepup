import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './step-component.jsx';
import { getCart, placeOrder } from './api';
import { useApp } from './context/AppContext';
import { formatPrice, resolveImageUrl } from './utils/helpers';

import "./styles/confirmation.css";
import {
    ReceiptText,
    MapPin,
    Package,
    CreditCard
} from "lucide-react";
export default function Confirmation() {
  const navigate = useNavigate();
  const { user, checkout, setLastOrder, setCheckout } = useApp();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.userid) {
      navigate('/personal-details');
      return;
    }
    if (checkout.buyNow) {
      setLoading(false);
      return;
    }
    getCart(user.userid)
      .then(setCart)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, checkout, navigate]);

  const items = checkout.buyNow && checkout.buyNowItem
    ? [checkout.buyNowItem]
    : (cart?.items || []);
  const address = user?.addresses?.[0];
  const addressLine = address
    ? `${address.home_no || ''} ${address.street || ''}, ${address.city || ''} - ${address.pincode || ''}`
    : 'No address saved';

  const subtotal = checkout.buyNow
    ? Number(checkout.buyNowItem?.price || 0) * (checkout.buyNowItem?.quantity || 1)
    : Number(cart?.subtotal || 0);
  const delivery = checkout.paymentMethod === 'COD' ? 99 : 0;
  const total = subtotal + delivery;

  const handleConfirm = async () => {
    if (!items.length) {
      setError('No items in order');
      return;
    }
    
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        userid: user.userid,
        payment_method: checkout.paymentMethod || 'Razorpay',
        use_cart: !checkout.buyNow,
      };
      if (checkout.buyNow) {
        payload.variant_id = checkout.variantId;
        payload.quantity = checkout.quantity || 1;
      }
      const order = await placeOrder(payload);
setLastOrder(order);

// Clear Buy Now state after successful order
setCheckout({
  buyNow: false,
  buyNowItem: null,
  variantId: null,
  quantity: 1,
});

if (checkout.paymentMethod === 'Razorpay') {
  navigate('/razorpay');
} else {
  navigate('/success');
}
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="statusMsg">Loading order summary...</p>;

  return (
    <div className="checkoutLayout">
      <CheckoutSteps step={3} />
      <div className="checkoutContent">
        <div className="confirmationContainer">
          <div className="confirmationCard">
            <div className="confirmationHeader">

    <div className="pageIcon">
        <ReceiptText size={30}/>
    </div>

    <h2>Review Your Order</h2>

    <p>
        Please review your order details before proceeding to payment.
    </p>

</div>

            <div className="orderItems">
<h3>
    <Package size={20}/>
    Items
</h3>              {!items.length ? (
                <p className="statusMsg">No items in order.</p>
              ) : (
                items.map((item, idx) => (
                  <div className="orderItemCard" key={item.cartitem_id || idx}>
<div className="itemImage">

    <img
        src={resolveImageUrl(item.image)}
        alt={item.prod_name}
    />

</div>                    <div className="itemInfo">

    <h4>{item.prod_name}</h4>

    <p>Color : {item.color}</p>

    <p>Size : UK {item.size}</p>

    <p>Quantity : {item.quantity}</p>

    <h3>{formatPrice(item.price || item.line_total)}</h3>

</div>
                  </div>
                ))
              )}

              <button
    className="editLink"
    onClick={() => navigate("/cart")}
>

    Edit Cart

</button>
            </div>

            <div className="shippingCard">
              <h3> <MapPin size={20}/>
    Delivery Address</h3>
              <p>{user.name}</p>

<p>{user.phone}</p>

<p>{addressLine}</p>

<button
    className="editLink"
    onClick={() => navigate("/personal-details")}
>
    Edit Address
</button>
            </div>
            <div className="paymentSummary">

    <h3>

        <CreditCard size={20}/>

        Payment Method

    </h3>

    <div className="paymentMethodCard">

        {checkout.paymentMethod === "Razorpay" ? (

            <>

                <h4>Razorpay</h4>

                <p>Cards • UPI • Net Banking</p>

            </>

        ) : (

            <>

                <h4>Cash on Delivery</h4>

                <p>Pay after delivery</p>

            </>

        )}

    </div>

</div>

            <div className="orderSummary">
              <h3>Order Summary</h3>

<div className="billRow">
    <span>Subtotal</span>
    <span>{formatPrice(subtotal)}</span>
</div>

<div className="billRow">
    <span>Delivery</span>
    <span>{delivery ? formatPrice(delivery) : "Free"}</span>
</div>

<div className="billRow totalRow">
    <span>Total</span>
    <span>{formatPrice(total)}</span>
</div>
            </div>

            {error && <p className="statusMsg error">{error}</p>}

            <div className="confirmationActions">
              <button type="button" onClick={handleConfirm} disabled={submitting || !items.length}>
                {submitting ? 'Placing Order...' : 'Continue to Payment ->'}
              </button>
              <button type="button" className="linkBtn" onClick={() => navigate('/cart')}>
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
