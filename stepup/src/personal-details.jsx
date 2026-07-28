import { useNavigate } from "react-router-dom";
import CheckoutSteps from "./step-component.jsx";

export default function Personal(){
  const navigate = useNavigate();
    return(

        <div className="checkoutLayout">

            <CheckoutSteps step={2}/>

            <div className="checkoutContent">

                <div className="form-container">

                             <div className="form-title">
                <div className="input-group">
                    <input
                    className="input2"
                    type="text"
                    placeholder="Name"
                    />
                </div>

                <div className="input-group">
                    <input
                    className="input2"
                    type="text"
                    placeholder="Mobile"
                    />
                </div>

                {/* Address Details */}

      <div className="addr-details">
        <h3>Address Details</h3>
      </div>

      <div className="input-group">
        <input
          className="addr"
          type="text"
          placeholder="House / Flat No."
        />
      </div>

      <div className="input-group">
        <input
          className="addr"
          type="text"
          placeholder="Street Name"
        />
      </div>

      <div className="input-group">
        <input
          className="addr"
          type="text"
          placeholder="City / Town"
        />
      </div>

      <div className="input-group">
        <input
          className="addr"
          type="text"
          placeholder="State"
        />
      </div>

      <div className="input-group">
        <input
          className="addr"
          type="text"
          placeholder="Pincode"
        />
      </div>

      <form>

      <div className="input-group">
        <input
          className="radio"
          type="radio"
        />CoD
      </div>

      <div className="input-group">
        <input
          className="radio"
          type="radio"
        />UPI
      </div>


      </form>


      <button className="bt2" onClick={()=>navigate('/confirmation/')}>
        Continue
      </button>
            </div>

                </div>

            </div>

        </div>

    );
}