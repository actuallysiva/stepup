export default function PasswordRecovery(){

    return(

        <div className="recoveryPage">

            <div className="recoveryCard">

                <h2>Password Recovery</h2>

                <p>
                    Enter your registered email or mobile number
                </p>

                <div className="containerInputdetail">

                    <input
                        type="text"
                        placeholder="Email / Mobile Number"
                    />

                    <button>
                        Send Verification
                    </button>

                </div>

                <div className="passwordOTP">

                    <h3>Enter OTP</h3>

                    <div className="otpInputs">

                        <input maxLength="1"/>
                        <input maxLength="1"/>
                        <input maxLength="1"/>
                        <input maxLength="1"/>
                        <input maxLength="1"/>
                        <input maxLength="1"/>

                    </div>

                    <a href="">
                        Resend OTP
                    </a>

                    <button>
                        Verify
                    </button>

                </div>

            </div>

        </div>

    );
}