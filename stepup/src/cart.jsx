import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeCartItem, updateCartItem } from './api';
import { useApp } from './context/AppContext';
import { formatPrice, resolveImageUrl } from './utils/helpers';

import "./styles/cart.css";
import { Trash2, ArrowLeft } from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { user, setCheckout } = useApp();  
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCart = useCallback(async () => {
    if (!user?.userid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getCart(user.userid);
      setCart(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.userid) {
      navigate('/verification', { state: { flow: 'checkout' } });
      return;
    }
    loadCart();
  }, [user, loadCart, navigate]);

  const handleQuantity = async (item, delta) => {
    const newQty = item.quantity + delta;
    try {
      if (newQty <= 0) {
        await removeCartItem(item.cartitem_id);
      } else {
        await updateCartItem(item.cartitem_id, newQty);
      }
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (cartitemId) => {
    try {
      await removeCartItem(cartitemId);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="statusMsg">Loading cart...</p>;

  const items = cart?.items || [];
  

  return (
    <div className="cartContainer">
      <div className="cartHeader">
        <button type="button" className="continueShoppingBtn" onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
    <span>Continue Shopping</span>
        </button>
        <h1>Shopping Cart
          <span className="cartCount">
        ({items.length})
    </span>
        </h1>
        
      </div>

      {error && <p className="statusMsg error">{error}</p>}

      <div className="cartContent">
        <div className="cartItems">
          {!items.length ? (
            <p className="statusMsg">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div className="cartItem" key={item.cartitem_id}>
                <img src={resolveImageUrl(item.image)} alt={item.prod_name} />
                <div className="cartItemInfo">
                  <h3>{item.prod_name}</h3>
                  <p className="cartVariant">

    {item.color} • UK {item.size}

</p>

<p className="cartPrice">

    {formatPrice(item.price)}

</p>
                  <div className="cartQuantity">
                    <button type="button" onClick={() => handleQuantity(item, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => handleQuantity(item, 1)}>+</button>
                  </div>
                </div>
                <button type="button" className="removeBtn" onClick={() => handleRemove(item.cartitem_id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="cartSummary">
          <h2>Order Summary</h2>

         <div className="summarySection">

          <div className="billRow">
            <span>Subtotal</span>
            <span>{formatPrice(cart?.subtotal || 0)}</span>
          </div>
          <div className="billRow">
            <span>Delivery</span>
            <span>{formatPrice(cart?.delivery_fee || 99)}</span>
          </div>
          <div className="billRow">
            <span>Estimated Delivery</span>
            <span>2–4 Days</span>
          </div>
          </div>
            <div className="summarySection">
            <div className="billRow">
              <span>Secure Payment</span>
              <span>SSL Encrypted</span>
            </div>
          </div>
          <div className="billRow totalRow">
            <span>Total</span>
            <span>{formatPrice(cart?.total || 0)}</span>
          </div>
          <button
  type="button"
  className="checkoutBtn"
  disabled={!items.length}
  onClick={() => {
    setCheckout({
        buyNow: false,
        buyNowItem: null,
        variantId: null,
        quantity: 1,
    });

    navigate('/verification', {
      state: { flow: 'checkout' }
    });
  }}
>
  Checkout
</button>
        </div>
      </div>
    </div>
  );
}
