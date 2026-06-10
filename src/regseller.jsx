import { useNavigate } from "react-router-dom";
function Registration() {
  const navigate = useNavigate();
  return (

    <div className="form-container">

      <h1 className="form-title">
        Seller Registration
      </h1>

      {/* Seller Details */}

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

      <div className="input-group">
        <input
          className="input2"
          type="email"
          placeholder="Email"
        />
      </div>

      <div className="input-group">
        <input
          className="input2"
          type="password"
          placeholder="Password"
        />
      </div>

      <div className="input-group">
        <input
          className="input2"
          type="password"
          placeholder="Confirm Password"
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

      <button className="bt2" onClick={()=>navigate('/success-registration/')}>
        Register
      </button>

    </div>

  );
}

export default Registration;