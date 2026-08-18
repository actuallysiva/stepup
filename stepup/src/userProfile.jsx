import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getUser, getWishlist, updateUser } from './api';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';


import "./styles/profiles.css";


export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, logoutUser } = useApp();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', home_no: '', street: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user?.userid) {
      navigate('/userLogin');
      return;
    }
    async function load() {
      try {
        const [profile, orderList, wishlist] = await Promise.all([
          getUser(user.userid),
          getOrders(user.userid),
          getWishlist(user.userid),
        ]);
        setUser(profile);
        setOrders(orderList);
        setWishlistCount(wishlist.count || 0);
        const addr = profile.addresses?.[0] || {};
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          home_no: addr.home_no || '',
          street: addr.street || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user?.userid]);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const updated = await updateUser(user.userid, {
        name: form.name,
        email: form.email,
        address: {
          home_no: form.home_no,
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode ? Number(form.pincode) : null,
        },
      });
      setUser(updated);
      setEditing(false);
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  if (loading && !user) return <p className="statusMsg">Loading profile...</p>;

  const addr = user?.addresses?.[0];
  const firstLetter = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className="profileContainer">
      <h1 className="profilePageTitle">
        My Account
      </h1>
      <div className="profileCard">
        <div className="profileHeader">
          <div className="profileAvatar" 
          style={{ backgroundColor: `hsl(${(firstLetter.charCodeAt(0) * 137) % 360}, 70%, 50%)` }}>
            {firstLetter}
          </div>
          <div className="profileIdentity">
          <h2>{user?.name}</h2>
          <p>StepUp Member</p>
          </div>
        </div>

        {editing ? (
          <div className="profileInfo">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
            <input value={form.home_no} onChange={(e) => setForm({ ...form, home_no: e.target.value })} placeholder="House No" />
            <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Street" />
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" />
            <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" />
            <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="Pincode" />
            <button type="button" className="editBtn" onClick={handleSave}>Save</button>
            <button type="button" className="logoutBtn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <div className="profileInfo">
            <h3>Personal Information</h3>
            <div className="profileRow"><span>Name</span><span>{user?.name}</span></div>
            <div className="profileRow"><span>Email</span><span>{user?.email || '—'}</span></div>
            <div className="profileRow"><span>Mobile</span><span>{user?.phone}</span></div>
            <div className="profileRow">
              <span>Address</span>
              <span>{addr ? `${addr.city}, ${addr.state}` : '—'}</span>
            </div>
          </div>
        )}

        <div className="profileStats">
          <div className="statBox"><h3>{orders.length}</h3><p>Orders</p></div>
          <div className="statBox"><h3>{wishlistCount}</h3><p>Wishlist</p></div>
        </div>

        {orders.length > 0 && (
          <div className="profileOrders">
            <h3>Recent Orders</h3>
            {orders.slice(0, 5).map((order) => (
              <div key={order.order_id} className="orderRow">
                <span className="orderId">{order.order_id}</span>
                <span className="orderAmount">{formatPrice(order.totalamount)}</span>
                <span>{order.order_status}</span>
              </div>
            ))}
          </div>
        )}

        {error && <p className="statusMsg error">{error}</p>}
        {message && <p className="statusMsg">{message}</p>}

        <div className="profileActions">
          {!editing && (
            <button type="button" className="editBtn" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
          <button type="button" className="logoutBtn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
