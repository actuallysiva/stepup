import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './step-component.jsx';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';

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
              <img src="./src/assets/success.png" alt="Success" />
            </div>
            <h3>YAY!! Your order is confirmed and scheduled for delivery</h3>
            <h5>Order ID: {lastOrder?.order_id || '—'}</h5>
            <h5>Total: {formatPrice(lastOrder?.totalamount || 0)}</h5>
            <button type="button" className="linkBtn" onClick={() => navigate('/userProfile')}>
              View Profile & Orders
            </button>
            <button type="button" className="bt2" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
