import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeSellerPassword } from './api';
import { useApp } from './context/AppContext';

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
    navigate('/login');
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
    <div className="centered-page">
      <div className="changePasswordCard">
        <h2>Create New Password</h2>
        <p>Your new password must be different from previous passwords.</p>

        <div className="passwordInput">
          <input type="password" placeholder="Current Password" value={current}
            onChange={(e) => setCurrent(e.target.value)} />
          <input type="password" placeholder="Enter New Password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" value={confirm}
            onChange={(e) => setConfirm(e.target.value)} />
        </div>

        {error && <p className="statusMsg error">{error}</p>}
        {message && <p className="statusMsg">{message}</p>}

        <button type="button" onClick={handleUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
        <button type="button" className="linkBtn" onClick={() => navigate('/dashboardseller')}>Back</button>
      </div>
    </div>
  );
}
