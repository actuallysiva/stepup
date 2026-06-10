

import CheckoutSteps from "./step-component.jsx";
import { useNavigate } from "react-router-dom";

export default function Verification(){

    const navigate = useNavigate();

    return(

        <div className="checkoutLayout">

            <CheckoutSteps step={1}/>

            <div className="checkoutContent">



            <div className="verificationCard">

                <h2>Mobile Verification</h2>

                <p className="verificationText">
                    Verify your mobile number before placing the order
                </p>

                <div className="verifyMobile">

                    <input
                        type="text"
                        placeholder="+91 Enter Mobile Number"
                    />

                    <button>
                        Send OTP
                    </button>

                </div>

                <div className="verifyOtp">

                    <h3>Enter OTP</h3>

                    <div className="otpGroup">

                        <input type="text" maxLength="1" />
                        <input type="text" maxLength="1" />
                        <input type="text" maxLength="1" />
                        <input type="text" maxLength="1" />
                        <input type="text" maxLength="1" />
                        <input type="text" maxLength="1" />

                    </div>

                    <p className="otpInfo">
                        OTP sent to xxxxxx1234
                    </p>

                    <a href="">
                        Resend OTP
                    </a>

                </div>

                <div className="verifyButton">

                    <button onClick={()=>navigate('/personal-details/')}>
                        Verify & Continue
                    </button>

                </div>

            </div>


            </div>

        </div>

    );
}