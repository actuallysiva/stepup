import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from './step-component.jsx';
import { createRazorpayOrder, verifyRazorpayPayment } from './api';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';


import "./styles/razorpay.css";

import {
    ShieldCheck,
    CreditCard,
    Lock
} from "lucide-react";

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
        <div className="razorpayHeader">
          <div className="pageIcon">
    <CreditCard size={30}/>
</div>

<h2>Secure Payment</h2>

<p>

Complete your purchase securely using Razorpay.

</p>
        </div>

        <div className="paymentAmountCard">
          <p>Total Amount</p>

<h2>{formatPrice(total)}</h2>
        </div>

        <div className="paymentInfocard">
          

<div className="paymentMethods">
<h3>

<ShieldCheck size={20}/>

Supported Payment Methods

</h3>
  <div className="methodItem">
    <span className="checkIcon">✓</span>
    <span>Credit & Debit Cards</span>
  </div>

  <div className="methodItem">
    <span className="checkIcon">✓</span>
    <span>UPI (Google Pay, PhonePe, Paytm)</span>
  </div>

  <div className="methodItem">
    <span className="checkIcon">✓</span>
    <span>Net Banking</span>
  </div>

  <div className="methodItem">
    <span className="checkIcon">✓</span>
    <span>Wallets</span>
  </div>
</div>

<div className="secureInfo">

<Lock size={18}/>

<span>

Your payment is encrypted and securely processed by Razorpay.

</span>

</div>
        </div>

        {error && <p className="statusMsg error">{error}</p>}

        <div className="paymentActions">
          <button type="button" onClick={handlePayment} disabled={loading}>
            {loading ? 'Opening Razorpay...' : 'Proceed to Pay ->'}
          </button>
          <button type="button" className="secondaryBtn" onClick={() => navigate('/confirmation')} disabled={loading}>
            Back to Review
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
