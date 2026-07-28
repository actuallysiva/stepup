export default function CheckoutSteps({step}){

    return(

        <div className="checkoutSteps">

            <div className={`stepItem ${step >= 1 ? "activeStep" : ""}`}>
                <div className="stepCircle"></div>
                <span>Mobile Verification</span>
            </div>

            <div className={`stepItem ${step >= 2 ? "activeStep" : ""}`}>
                <div className="stepCircle"></div>
                <span>Personal Details</span>
            </div>

            <div className={`stepItem ${step >= 3 ? "activeStep" : ""}`}>
                <div className="stepCircle"></div>
                <span>Confirmation</span>
            </div>

            <div className={`stepItem ${step >= 4 ? "activeStep" : ""}`}>
                <div className="stepCircle"></div>
                <span>UPI</span>
            </div>

            <div className={`stepItem ${step >= 5 ? "activeStep" : ""}`}>
                <div className="stepCircle"></div>
                <span>Order Success</span>
            </div>

        </div>

    );
}