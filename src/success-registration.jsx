export default function SuccessRegistration() {
    return (
        <div className="successRegistrationContainer">

            <div className="greetings">

                <div className="imageContainer">
                    <img
                        src="/success.png"
                        alt="Success Registration"
                    />
                </div>

                <h2>Registration Successful 🎉</h2>

                <p className="successMessage">
                    Your seller account has been created successfully.
                    You can now login and start managing your products.
                </p>

                <div className="successRegistrationButtons">

                    <button className="loginButton">
                        Login to Profile
                    </button>

                    <button className="homeButton">
                        Go to Home
                    </button>

                </div>

            </div>

        </div>
    );
}