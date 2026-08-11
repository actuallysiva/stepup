import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeCartItem, updateCartItem } from './api';
import { useApp } from './context/AppContext';
import { formatPrice, resolveImageUrl } from './utils/helpers';

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
      <div className="topContainer">
        <h1>Shopping Cart</h1>
        <button type="button" className="continueShoppingBtn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>

      {error && <p className="statusMsg error">{error}</p>}

      <div className="cartContent">
        <div className="middleContainer">
          {!items.length ? (
            <p className="statusMsg">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div className="cartItem" key={item.cartitem_id}>
                <img src={resolveImageUrl(item.image)} alt={item.prod_name} />
                <div className="itemDetails">
                  <h3>{item.prod_name}</h3>
                  <p>Size: {item.size}</p>
                  <p>Color: {item.color}</p>
                  <p>Price: {formatPrice(item.price)}</p>
                  <div className="quantityContainer">
                    <button type="button" onClick={() => handleQuantity(item, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => handleQuantity(item, 1)}>+</button>
                  </div>
                </div>
                <button type="button" className="removeBtn" onClick={() => handleRemove(item.cartitem_id)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="bottomContainer">
          <h2>Order Summary</h2>
          <div className="billRow">
            <span>Subtotal</span>
            <span>{formatPrice(cart?.subtotal || 0)}</span>
          </div>
          <div className="billRow">
            <span>Delivery</span>
            <span>{formatPrice(cart?.delivery_fee || 99)}</span>
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
