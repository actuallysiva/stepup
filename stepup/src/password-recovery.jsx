import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetSellerPassword, sendOtp } from './api';
import { handleOtpInput, handleOtpKeyDown, readOtpFromRefs } from './utils/helpers';

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  const handleSend = async () => {
    if (!phone) { setError('Enter mobile number'); return; }
    setLoading(true);
    try {
      await sendOtp(phone);
      setOtpSent(true);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (password !== confirm) { setError('Passwords do not match'); return; }
    const otp = readOtpFromRefs(otpRefs.current);
    if (otp.length !== 6) { setError('Enter 6-digit OTP'); return; }
    setLoading(true);
    try {
      await resetSellerPassword({
        phone,
        otp,
        new_password: password,
        confirm_password: confirm,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-page">
      <div className="recoveryCard">
        <h2>Password Recovery</h2>
        <p>Enter your registered mobile number</p>

        <div className="containerInputdetail">
          <input type="text" placeholder="Mobile Number" value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
          <button type="button" onClick={handleSend} disabled={loading}>Send OTP</button>
        </div>

        {otpSent && (
          <div className="passwordOTP">
            <h3>Enter OTP & New Password</h3>
            <div className="otpInputs">
              {Array.from({ length: 6 }).map((_, i) => (
                <input key={i} maxLength={1}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  onChange={(e) => handleOtpInput(e, i, otpRefs.current)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i, otpRefs.current)} />
              ))}
            </div>
            <button type="button" className="linkBtn" onClick={handleSend}>Resend OTP</button>
            <input type="password" placeholder="New Password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} />
            <button type="button" onClick={handleReset} disabled={loading}>Reset Password</button>
          </div>
        )}

        {error && <p className="statusMsg error">{error}</p>}
      </div>
    </div>
  );
}
