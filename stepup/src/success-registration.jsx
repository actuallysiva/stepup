import { useNavigate } from 'react-router-dom';
import successIcon from './assets/success.png';

import {
    Package,
    ChartColumn,
    ShoppingBag
} from "lucide-react";

import "./styles/success-registration.css";

export default function SuccessRegistration() {

  const navigate = useNavigate();

  return (

    <div className="sellerAuthPage">

      <div className="successRegistrationCard">

        <div className="imageContainer">

          <img
            src={successIcon}
            alt="Registration Success"
          />

        </div>

        <h2>Seller Account Created</h2>

        <p className="sellerSubtitle">

          Welcome to StepUP Seller Hub.

          Your account has been created successfully.

        </p>

        <div className="successFeatures">

    <div>

        <Package size={18}/>

        <span>Start uploading products</span>

    </div>

    <div>

        <ChartColumn size={18}/>

        <span>Manage inventory</span>

    </div>

    <div>

        <ShoppingBag size={18}/>

        <span>Track customer orders</span>

    </div>

</div>

        <div className="successButtons">

          <button
            type="button"
            className="sellerRegisterBtn"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>

          <button
            type="button"
            className="secondaryBtn"
            onClick={() => navigate('/')}
          >
            Go to Home
          </button>

        </div>

      </div>

    </div>

  );

}