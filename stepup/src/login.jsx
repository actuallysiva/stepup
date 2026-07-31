import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSeller } from './api';
import { useApp } from './context/AppContext';
import { Link } from "react-router-dom";

function Login() {
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
    <div className="centered-page">
      <div className="form-container">
        <h1 className="form-title">Login</h1>

      <div className="input-group">
        <input
          className="name1"
          type="text"
          placeholder="Mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      <div className="input-group">
        <input
          className="name1"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="statusMsg error">{error}</p>}

      <button type="button" className="bt" onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="forgotPassword">
        <Link to="/password-recovery" className="simpleLink">
          Forgot Password?
        </Link>
        <Link to="/regseller" className="simpleLink">
          Not a member? Register
        </Link>
      </div>
      </div>
    </div>
  );
}

export default Login;
