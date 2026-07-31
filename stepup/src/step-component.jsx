export default function CheckoutSteps({ step }) {
  return (
    <div className="checkoutSteps">
      <div className={`stepItem ${step >= 1 ? "activeStep" : ""}`}>
        <div className="stepCircle">1</div>
        <span>Mobile Verification</span>
      </div>

      <div className={`stepItem ${step >= 2 ? "activeStep" : ""}`}>
        <div className="stepCircle">2</div>
        <span>Personal Details</span>
      </div>

      <div className={`stepItem ${step >= 3 ? "activeStep" : ""}`}>
        <div className="stepCircle">3</div>
        <span>Confirmation</span>
      </div>

      <div className={`stepItem ${step >= 4 ? "activeStep" : ""}`}>
        <div className="stepCircle">4</div>
        <span>Order Success</span>
      </div>
    </div>
  );
}