export default function ChangePassword(){

    return(

        <div className="changePasswordPage">

            <div className="changePasswordCard">

                <h2>Create New Password</h2>

                <p>
                    Your new password must be different
                    from previous passwords.
                </p>

                <div className="passwordInput">

                    <input
                        type="password"
                        placeholder="Enter New Password"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                    />

                </div>

                <div className="passwordTips">

                    <span>
                        Minimum 8 characters
                    </span>

                    <span>
                        Include numbers and symbols
                    </span>

                </div>

                <button>
                    Update Password
                </button>

            </div>

        </div>

    );
}