import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSeller } from './api';
import { useApp } from './context/AppContext';
import { Link } from "react-router-dom";

import "./styles/signin.css";

export default function SignIn() {
  const navigate = useNavigate();
  const { setSeller } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('Enter phone and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const seller = await loginSeller({ phone: Number(phone), password });
      setSeller(seller);
      navigate('/dashboardseller');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sellerAuthPage">
      <div className="sellerLoginCard">
        <div className="sellerBrand">

    <h3>STEPUP</h3>

    <span>Seller Hub</span>

</div>

<h1>Seller SignIn</h1>

<p className="sellerSubtitle">

Manage your store, inventory and customer orders.
</p>

      <div className="input-group">
        <input
          className="sellerInput"
          type="text"
          autoComplete="username"
          placeholder="Enter Mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      <div className="input-group">
        <input
          className="sellerInput"
          type="password"
          autoComplete="current-password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="statusMsg error">{error}</p>}

      <button type="button" className="sellerLoginBtn" onClick={handleLogin} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="sellerLinks">
        <Link to="/password-recovery" className="sellerLink">
          Forgot Password?
        </Link>
        <Link to="/regseller" className="sellerLink">
          Not a member? Register
        </Link>
      </div>
      </div>
    </div>
  );
}

