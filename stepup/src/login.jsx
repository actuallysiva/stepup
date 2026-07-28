import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  return (
       
    <div className="form-container">

      <h1 className="form-title">Login</h1>

      <div className="input-group">
        <input
          className="name1"
          type="text"
          placeholder="Enter your name"
        />
      </div>

      <div className="input-group">
        <input
          className="name1"
          type="password"
          placeholder="Enter password"
        />
      </div>

      <button className="bt" onClick={()=>navigate('/dashboardseller/')}>
        Login
      </button>
        <br></br>
        <br></br>
      <div className="forgotPassword">
        <a href="">Forgot Password?</a>
        <a href="/regseller">Not a member? Register</a>
      </div>

    </div>
  );
}

export default Login;