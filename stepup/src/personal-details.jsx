import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutSteps from './step-component.jsx';
import { getUserByPhone, registerUser, updateUser } from './api';
import { useApp } from './context/AppContext';

export default function Personal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkout, setCheckout, user, setUser } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: checkout.phone || user?.phone || '',
    email: user?.email || '',
    home_no: user?.addresses?.[0]?.home_no || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || '',
    pincode: user?.addresses?.[0]?.pincode || '',
    paymentMethod: checkout.paymentMethod || 'Razorpay',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!checkout.verified) {
      navigate('/verification');
      return;
    }
    async function loadExisting() {
      if (!checkout.phone) return;
      try {
        const existing = await getUserByPhone(checkout.phone);
        setUser(existing);
        setForm((prev) => ({
          ...prev,
          name: existing.name || prev.name,
          phone: existing.phone || prev.phone,
          email: existing.email || prev.email,
          home_no: existing.addresses?.[0]?.home_no || prev.home_no,
          street: existing.addresses?.[0]?.street || prev.street,
          city: existing.addresses?.[0]?.city || prev.city,
          state: existing.addresses?.[0]?.state || prev.state,
          pincode: existing.addresses?.[0]?.pincode || prev.pincode,
        }));
      } catch {
        // New user — form stays as entered
      }
    }
    loadExisting();
  }, [checkout, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      setError('Name and mobile are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let savedUser;
      if (user?.userid) {
        savedUser = await updateUser(user.userid, {
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
      } else {
        savedUser = await registerUser({
          name: form.name,
          phone: Number(form.phone),
          email: form.email,
          home_no: form.home_no,
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode ? Number(form.pincode) : null,
        });
      }
      setUser(savedUser);
      const flow = location.state?.flow || 'checkout';
      if (flow === 'profile') {
        navigate('/userProfile');
      } else if (flow === 'wishlist') {
        navigate('/wishlist');
      } else {
        setCheckout({ paymentMethod: form.paymentMethod });
        navigate('/confirmation');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkoutLayout">
      <CheckoutSteps step={2} />
      <div className="checkoutContent">
        <div className="form-container">
          <div className="form-title">
            <div className="input-group">
              <input className="input2" type="text" placeholder="Name" value={form.name}
                onChange={(e) => handleChange('name', e.target.value)} />
            </div>
            <div className="input-group">
              <input className="input2" type="text" placeholder="Mobile" value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))} />
            </div>
            <div className="input-group">
              <input className="input2" type="email" placeholder="Email (optional)" value={form.email}
                onChange={(e) => handleChange('email', e.target.value)} />
            </div>

            <div className="addr-details"><h5>Address</h5></div>
            <div className="input-group">
              <input className="addr" type="text" placeholder="House / Flat No." value={form.home_no}
                onChange={(e) => handleChange('home_no', e.target.value)} />
            </div>
            <div className="input-group">
              <input className="addr" type="text" placeholder="Street Name" value={form.street}
                onChange={(e) => handleChange('street', e.target.value)} />
            </div>
            <div className="input-group">
              <input className="addr" type="text" placeholder="City / Town" value={form.city}
                onChange={(e) => handleChange('city', e.target.value)} />
            </div>
            <div className="input-group">
              <input className="addr" type="text" placeholder="State" value={form.state}
                onChange={(e) => handleChange('state', e.target.value)} />
            </div>
            <div className="input-group">
              <input className="addr" type="text" placeholder="Pincode" value={form.pincode}
                onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))} />
            </div>

            <div className="input-group">
              <label>
                <input className="radio" type="radio" name="payment" checked={form.paymentMethod === 'Razorpay'}
                  onChange={() => handleChange('paymentMethod', 'Razorpay')} />
                Razorpay (Card/UPI/Net Banking)
              </label>
            </div>
            <div className="input-group">
              <label>
                <input className="radio" type="radio" name="payment" checked={form.paymentMethod === 'COD'}
                  onChange={() => handleChange('paymentMethod', 'COD')} />
                Cash on Delivery
              </label>
            </div>

            {error && <p className="statusMsg error">{error}</p>}

            <button type="button" className="bt2" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
