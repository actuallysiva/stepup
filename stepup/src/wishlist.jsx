import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWishlist, moveWishlistToCart, removeFromWishlist } from './api';
import { useApp } from './context/AppContext';
import { formatPrice, resolveImageUrl } from './utils/helpers';

import "./styles/wishlist.css";
import { Trash2, ArrowLeft } from "lucide-react";

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWishlist = useCallback(async () => {
    if (!user?.userid) return;
    setLoading(true);
    try {
      const data = await getWishlist(user.userid);
      setItems(data.items || []);
      setCount(data.count || 0);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.userid) {
      navigate('/verification', { state: { flow: 'wishlist' } });
      return;
    }
    loadWishlist();
  }, [user, loadWishlist, navigate]);

  const handleRemove = async (wishlistId) => {
    try {
      await removeFromWishlist(wishlistId);
      await loadWishlist();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMoveToCart = async (wishlistId) => {
    try {
      await moveWishlistToCart(wishlistId);
      await loadWishlist();
    } catch (err) {
      setError(err.message);
    }
  };
  if (loading) return <p className="statusMsg">Loading wishlist...</p>;
console.log(items[0])

  return (
    <div className="wishlistContainer">
      <div className="wishlistHeader">
        <div>
        <h1>My Wishlist</h1>
        <p>{count} Saved Items</p>
      </div>
      <button
        className="continueShoppingBtn"
        onClick={() => navigate("/")}
    >
      <ArrowLeft size={18}/>
        Continue Shopping
    </button>
      </div>

      {error && <p className="statusMsg error">{error}</p>}

      <div className="wishlistGrid">
        {!items.length ? (
          <p className="statusMsg">Your wishlist is empty.</p>
        ) : (
          items.map((item) => (
            <div className="wishlistCard" key={item.wishlist_id}>
              <img src={resolveImageUrl(item.image)} alt={item.prod_name} />
              <div className="wishlistDetails">
                <h3>{item.prod_name}</h3>
                <p className="wishlistMeta">
    {item.color} • UK {item.size}
    
</p>
                <h2>{formatPrice(item.price)}</h2>

<p className="wishlistStock">
In Stock
</p>
              </div>
              <div className="wishlistActions">
                <button type="button" className="moveBtn" onClick={() => handleMoveToCart(item.wishlist_id)}>
                  Add To Cart
                </button>
                <button type="button" className="removeBtn" onClick={() => handleRemove(item.wishlist_id)}>
                      <Trash2 size={18} />

                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
