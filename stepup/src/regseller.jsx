import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerSeller } from './api';

import "./styles/regseller.css";

import {
  Store,
  User,
  MapPin,
  ShieldCheck
} from "lucide-react";

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
    <div className="sellerAuthPage">
  <div className="sellerRegisterCard">
        <div className="sellerBrand">

    <h3>STEPUP</h3>

    <span>Seller Hub</span>

</div>

<h1>Create Seller Account</h1>

<p className="sellerSubtitle">

Register your shop and start selling on StepUP.

</p>

<button
    type="button"
    className="backLink"
    onClick={() => navigate("/signin")}
>

Already have an account?  Sign In
</button>

      <div className="input-group">
        <h3 className="registerSectionTitle">

<User size={20}/>

Personal Information

</h3>
<div className="registerGrid">

        <input className="sellerInput" type="text" placeholder="Name" value={form.name}
          onChange={(e) => handleChange('name', e.target.value)} />
        <input className="sellerInput" type="text" placeholder="Shop Name" value={form.shopname}
          onChange={(e) => handleChange('shopname', e.target.value)} />
        <input className="sellerInput" type="text" placeholder="Mobile" value={form.phone}
          onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))} />
        <input className="sellerInput" type="email" placeholder="Email" value={form.email}
          onChange={(e) => handleChange('email', e.target.value)} />

      </div>
      </div>
      <div className="input-group">
        <h3 className="registerSectionTitle">

<ShieldCheck size={20}/>

Security

</h3>
<div className="registerGrid">

        <input className="sellerInput" type="password" placeholder="Password" value={form.password}
          onChange={(e) => handleChange('password', e.target.value)} />
        <input className="sellerInput" type="password" placeholder="Confirm Password" value={form.confirm_password}
          onChange={(e) => handleChange('confirm_password', e.target.value)} />
      </div>
      </div>

<h3 className="registerSectionTitle">

<MapPin size={20}/>

Shop Address

</h3>
<div className="registerGrid">

      <div className="input-group">
        <input className="sellerInput" type="text" placeholder="Shop / Flat No." value={form.shopno}
          onChange={(e) => handleChange('shopno', e.target.value)} />
      </div>
      <div className="input-group">
        <input className="sellerInput" type="text" placeholder="Street Name" value={form.street}
          onChange={(e) => handleChange('street', e.target.value)} />
      </div>
      <div className="input-group">
        <input className="sellerInput" type="text" placeholder="City / Town" value={form.city}
          onChange={(e) => handleChange('city', e.target.value)} />
      </div>
      <div className="input-group">
        <input className="sellerInput" type="text" placeholder="State" value={form.state}
          onChange={(e) => handleChange('state', e.target.value)} />
      </div>
      <div className="input-group">
        <input className="sellerInput" type="text" placeholder="Pincode" value={form.pincode}
          onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))} />
      </div>
      </div>

      {error && <p className="statusMsg error">{error}</p>}

      <button type="button" className="sellerRegisterBtn" onClick={handleRegister} disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Seller Account'}
      </button>
      </div>
    </div>
  );
}

export default Registration;
