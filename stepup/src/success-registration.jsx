import { useNavigate } from 'react-router-dom';
import  successIcon  from './assets/success.png'

export default function SuccessRegistration() {
  const navigate = useNavigate();

  return (
    <div className="centered-page">
      <div className="successRegistrationContainer" style={{ maxWidth: '700px', width: '100%' }}>
        <div className="greetings">
        <div className="imageContainer">
          <img src={ successIcon } alt="Registration Success" />
        </div>
        <h2>Registration Successful 🎉</h2>
        <p className="successMessage">
          Your seller account has been created successfully.
          You can now login and start managing your products.
        </p>
        <div className="successRegistrationButtons">
          <button type="button" className="loginButton" onClick={() => navigate('/login')}>
            Login to Profile
          </button>
          <button type="button" className="homeButton" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
