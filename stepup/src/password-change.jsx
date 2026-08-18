import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeSellerPassword } from './api';
import { useApp } from './context/AppContext';

import "./styles/password-change.css";

import {
    LockKeyhole,
    ShieldCheck
} from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { seller } = useApp();
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  if (!seller?.sellerid) {
    navigate('/signin');
    return null;
  }

  const handleUpdate = async () => {
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await changeSellerPassword(seller.sellerid, {
        current_password: current,
        new_password: password,
        confirm_password: confirm,
      });
      setMessage('Password updated successfully');
      setTimeout(() => navigate('/dashboardseller'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sellerAuthPage">

    <div className="changePasswordCard">
        <div className="pageIcon">

    <LockKeyhole size={34}/>

</div>

<h2>Change Password</h2>

<p className="sellerSubtitle">

Keep your seller account secure by choosing a strong password.

</p>

        <div className="passwordSection">

    <h3>

        <ShieldCheck size={20}/>

        Password Details

    </h3>

    <div className="passwordColumn">

        <input
            className="sellerInput"
            type="password"
            placeholder="Current Password"
            value={current}
            onChange={(e)=>setCurrent(e.target.value)}
        />

        <input
            className="sellerInput"
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
        />

        <input
            className="sellerInput"
            type="password"
            placeholder="Confirm New Password"
            value={confirm}
            onChange={(e)=>setConfirm(e.target.value)}
        />

    </div>

</div>

        {error && <p className="statusMsg error">{error}</p>}
        {message && <p className="statusMsg">{message}</p>}

<button
    type="button"
    className="sellerRegisterBtn"
    onClick={handleUpdate}
    disabled={loading}
>          {loading ? 'Updating...' : 'Update Password'}
        </button>
<div className="authFooter">

    <button
        type="button"
        className="backLink"
        onClick={() => navigate('/dashboardseller')}
    >

        ← Back to Dashboard

    </button>

</div>
      </div>
    </div>
  );
}
