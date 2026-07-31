import { useNavigate } from 'react-router-dom';
import SellerLayout from './layouts/SellerLayout';

export default function SuccessStock() {
  const navigate = useNavigate();

  return (
    <SellerLayout>
      <div className="successContainer">
        <div className="greetings">
          <div className="imageContainer">
            <img src="./src/assets/success.png" alt="Success stock" />
          </div>
          <h3>Your stocks have been successfully updated</h3>
          <button type="button" className="linkBtn" onClick={() => navigate('/availablestockseller')}>
            Check Availability
          </button>
          <div className="successButtons">
            <button type="button" onClick={() => navigate('/uploadstock')}>Upload Again</button>
            <button type="button" onClick={() => navigate('/dashboardseller')}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
