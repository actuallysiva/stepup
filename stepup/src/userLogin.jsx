import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendOtp, verifyOtp, getUserByPhone } from './api';
import { useApp } from './context/AppContext';
import { handleOtpInput, handleOtpKeyDown, readOtpFromRefs } from './utils/helpers';

export default function UserLogin() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [maskedPhone, setMaskedPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('Enter mobile number');
      return;
    }
    if (phone.trim().length !== 10) {
      setError('Enter valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await sendOtp(phone.trim());
      setOtpSent(true);
      const p = phone.trim();
      setMaskedPhone(`${'*'.repeat(Math.max(0, p.length - 4))}${p.slice(-4)}`);
      if (response.otp) {
        alert(`Your OTP is: ${response.otp}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const otp = readOtpFromRefs(otpRefs.current);
    if (otp.length !== 6) {
      setError('Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyOtp(phone.trim(), otp);
      let existingUser = null;
      try {
        existingUser = await getUserByPhone(phone.trim());
        setUser(existingUser);
        localStorage.setItem('user', JSON.stringify(existingUser));
        navigate('/userProfile');
      } catch {
        setError('User not found. Please register first.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="centered-page">
      <div className="form-container">
        <h1 className="form-title">User Login</h1>
        <p className="form-subtitle">Login with your mobile number using OTP</p>

        <div className="input-group">
          <label>Mobile Number</label>
          <div className="phoneInputWrapper">
            <span className="countryCode">+91 India</span>
            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              maxLength={10}
            />
          </div>
        </div>

        {!otpSent ? (
          <button type="button" className="bt" onClick={handleSendOtp} disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <>
            <div className="verifyOtp">
              <label>Enter OTP</label>
              <div className="otpGroup">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    maxLength={1}
                    onChange={(e) => handleOtpInput(e, i, otpRefs.current)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i, otpRefs.current)}
                  />
                ))}
              </div>
              <p className="otpInfo">OTP sent to {maskedPhone}</p>
              <button type="button" className="linkBtn" onClick={handleSendOtp}>Resend OTP</button>
            </div>

            <button type="button" className="bt" onClick={handleVerify} disabled={loading}>
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </>
        )}

        {error && <p className="statusMsg error">{error}</p>}

        <div className="forgotPassword">
          <a href="/verification" className="simpleLink">
            New User? Register
          </a>
        </div>
      </div>
    </div>
  );
}
