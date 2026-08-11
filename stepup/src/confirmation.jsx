import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './step-component.jsx';
import { getCart, placeOrder } from './api';
import { useApp } from './context/AppContext';
import { formatPrice, resolveImageUrl } from './utils/helpers';

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
        <div className="confirmationPage">
          <div className="confirmationCard">
            <div className="titleConfirmation">
              <h2>Order Confirmation</h2>
              <p>Please verify all details before placing your order.</p>
            </div>

            <div className="detailsPurchase">
              <h3>Product Details</h3>
              {!items.length ? (
                <p className="statusMsg">No items in order.</p>
              ) : (
                items.map((item, idx) => (
                  <div className="detailsProduct" key={item.cartitem_id || idx}>
                    <img src={resolveImageUrl(item.image)} alt={item.prod_name} />
                    <div>
                      <h4>Name : {item.prod_name}</h4>
                      <h4>Size : {item.size}</h4>
                      <h4>Color : {item.color}</h4>
                      <h4>Quantity : {item.quantity}</h4>
                      <h4>Price : {formatPrice(item.price || item.line_total)}</h4>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="detailsUser">
              <h3>Delivery Details</h3>
              <h4>Name : {user.name}</h4>
              <h4>Mobile : {user.phone}</h4>
              <h4>Address : {addressLine}</h4>
              <h4>Payment Mode : {checkout.paymentMethod}</h4>
            </div>

            <div className="orderSummary">
              <h3>Order Summary</h3>
              <h4>Product Total : {formatPrice(subtotal)}</h4>
              <h4>Shipping : {delivery ? formatPrice(delivery) : 'Free'}</h4>
              <h2>Total : {formatPrice(total)}</h2>
            </div>

            {error && <p className="statusMsg error">{error}</p>}

            <div className="confirmOrder">
              <button type="button" onClick={handleConfirm} disabled={submitting || !items.length}>
                {submitting ? 'Placing Order...' : 'Confirm Order'}
              </button>
              <button type="button" className="linkBtn" onClick={() => navigate('/cart')}>
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
