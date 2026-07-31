import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSeller } from './api';

function Registration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', shopname: '', phone: '', email: '', password: '', confirm_password: '',
    shopno: '', street: '', city: '', state: '', pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async () => {
    if (!form.name || !form.phone || !form.password) {
      setError('Name, mobile and password are required');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerSeller({
        name: form.name,
        shopname: form.shopname || form.name,
        shopno: form.shopno,
        phone: Number(form.phone),
        email: form.email,
        password: form.password,
        confirm_password: form.confirm_password,
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode ? Number(form.pincode) : null,
      });
      navigate('/success-registration');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-page">
      <div className="form-container">
        <h1 className="form-title">Seller Registration</h1>

      <div className="input-group">
        <input className="input2" type="text" placeholder="Name" value={form.name}
          onChange={(e) => handleChange('name', e.target.value)} />
      </div>
      <div className="input-group">
        <input className="input2" type="text" placeholder="Shop Name" value={form.shopname}
          onChange={(e) => handleChange('shopname', e.target.value)} />
      </div>
      <div className="input-group">
        <input className="input2" type="text" placeholder="Mobile" value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))} />
      </div>
      <div className="input-group">
        <input className="input2" type="email" placeholder="Email" value={form.email}
          onChange={(e) => handleChange('email', e.target.value)} />
      </div>
      <div className="input-group">
        <input className="input2" type="password" placeholder="Password" value={form.password}
          onChange={(e) => handleChange('password', e.target.value)} />
      </div>
      <div className="input-group">
        <input className="input2" type="password" placeholder="Confirm Password" value={form.confirm_password}
          onChange={(e) => handleChange('confirm_password', e.target.value)} />
      </div>

      <div className="addr-details"><h3>Address Details</h3></div>
      <div className="input-group">
        <input className="addr" type="text" placeholder="Shop / Flat No." value={form.shopno}
          onChange={(e) => handleChange('shopno', e.target.value)} />
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

      {error && <p className="statusMsg error">{error}</p>}

      <button type="button" className="bt2" onClick={handleRegister} disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
      </div>
    </div>
  );
}

export default Registration;
