import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './step-component.jsx';
import { createRazorpayOrder, verifyRazorpayPayment } from './api';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';

export default function Razorpay() {
  const navigate = useNavigate();
  const { lastOrder } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const total = lastOrder?.totalamount || '0';

  // Load Razorpay script dynamically when component mounts
  useEffect(() => {
    const loadScript = () => {
      if (window.Razorpay) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setError('Failed to load payment gateway');
      document.body.appendChild(script);
    };

    loadScript();

    // Cleanup script when component unmounts
    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!lastOrder?.order_id) {
      setError('No order found');
      return;
    }

    if (!scriptLoaded || !window.Razorpay) {
      setError('Payment gateway not loaded. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create Razorpay order
      const razorpayOrder = await createRazorpayOrder({
        order_id: lastOrder.order_id,
        amount: total
      });

      // Step 2: Open Razorpay checkout
      const options = {
        key: razorpayOrder.razorpay_key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'StepUP',
        description: 'Payment for your order',
        order_id: razorpayOrder.razorpay_order_id,
        handler: async function (response) {
          // Step 3: Verify payment on backend
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: lastOrder.order_id
            });
            navigate('/success');
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: lastOrder.userid?.name || '',
          email: lastOrder.userid?.email || '',
          contact: lastOrder.userid?.phone?.toString() || ''
        },
        theme: {
          color: '#7c3aed'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment cancelled by user');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="checkoutLayout">
      <CheckoutSteps step={3} />
      <div className="checkoutContent">
        <div className="razorpayCard">
        <div className="titleContainer">
          <h1>Pay with Razorpay</h1>
          <p>Secure payment via Razorpay - Cards, UPI, Net Banking, Wallets</p>
        </div>

        <div className="paymentSummary">
          <h3>Order Total</h3>
          <h2>{formatPrice(total)}</h2>
        </div>

        <div className="qrContainer" style={{ flexDirection: 'column', textAlign: 'center' }}>
          <div className="detailsQr">
            <h3>Payment Methods Supported</h3>
            <p>Credit/Debit Cards</p>
            <p>UPI (Google Pay, PhonePe, Paytm)</p>
            <p>Net Banking</p>
            <p>Wallets (Paytm, Amazon Pay, etc.)</p>
            <p className="paymentInfo">Your payment is secured by Razorpay</p>
          </div>
        </div>

        {error && <p className="statusMsg error">{error}</p>}

        <div className="paymentActions">
          <button type="button" onClick={handlePayment} disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
          <button type="button" className="secondaryBtn" onClick={() => navigate('/confirmation')} disabled={loading}>
            Back
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
