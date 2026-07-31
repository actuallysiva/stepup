import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutSteps from './step-component.jsx';
import { sendOtp, verifyOtp, getUserByPhone } from './api';
import { useApp } from './context/AppContext';
import { handleOtpInput, handleOtpKeyDown, readOtpFromRefs } from './utils/helpers';

export default function Verification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkout, setCheckout, setUser } = useApp();
  const [phone, setPhone] = useState(checkout.phone || '');
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
    setLoading(true);
    setError('');
    try {
      const response = await sendOtp(phone.trim());
      setOtpSent(true);
      const p = phone.trim();
      setMaskedPhone(`${'*'.repeat(Math.max(0, p.length - 4))}${p.slice(-4)}`);
      setCheckout({ phone: p.trim() });
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
      setCheckout({ phone: phone.trim(), verified: true });
      let existingUser = null;
      try {
        existingUser = await getUserByPhone(phone.trim());
        setUser(existingUser);
      } catch {
        // New customer
      }
      
      const flow = location.state?.flow || 'checkout';
      if (flow === 'checkout') {
        navigate('/personal-details', { state: { flow: 'checkout' } });
      } else if (flow === 'wishlist') {
        if (existingUser && existingUser.userid) {
          navigate('/wishlist');
        } else {
          navigate('/personal-details', { state: { flow: 'wishlist' } });
        }
      } else {
        if (existingUser && existingUser.userid) {
          navigate('/userProfile');
        } else {
          navigate('/personal-details', { state: { flow: 'profile' } });
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkoutLayout">
      <CheckoutSteps step={1} />
      <div className="checkoutContent">
        <div className="verificationCard">
          <h2>Mobile Verification</h2>
          <p className="verificationText">Verify your mobile number before placing the order</p>

          <div className="verifyMobile">
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
            <button type="button" onClick={handleSendOtp} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>

          {otpSent && (
            <div className="verifyOtp">
              <h3>Enter OTP</h3>
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
          )}

          {error && <p className="statusMsg error">{error}</p>}

          <div className="verifyButton">
            <button type="button" onClick={handleVerify} disabled={loading || !otpSent}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
