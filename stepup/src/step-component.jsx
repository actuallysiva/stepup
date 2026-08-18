import "./styles/checkout-sidebar.css";
import {  ShieldCheck,  Truck,  RotateCcw,  CreditCard, Check} from "lucide-react";

const steps = [
  {
    title: "Mobile Verification",
    subtitle: "Verify your phone",
  },
  {
    title: "Personal Details",
    subtitle: "Shipping address",
  },
  {
    title: "Confirmation",
    subtitle: "Review order",
  },
  {
    title: "Complete",
    subtitle: "Order placed",
  },
];

export default function CheckoutSteps({ step }) {
  return (
    <div className="checkoutSteps">
      <div className="stepsList">
  {steps.map((item, index) => {
    const number = index + 1;

    return (
      <div
        key={number}
        className={`stepWrapper ${
          step > number ? "completedStep" : ""
        } ${step === number ? "activeStep" : ""}`}
      >
        <div className="stepItem">

          <div className="stepCircle">
            {step > number ? (
              <Check size={18} strokeWidth={3}/>
            ) : (
              number
            )}
          </div>

          <div className="stepText">
            <h4>{item.title}</h4>
            <p>{item.subtitle}</p>
          </div>

        </div>
      </div>
    );
  })}
</div>
      <div className="checkoutInfo">

  <div className="checkoutInfoCard">
    <ShieldCheck className="checkoutIcon" size={20} />

    <div>
      <h4>Secure Checkout</h4>
      <p>Your data is encrypted end-to-end.</p>
    </div>
  </div>

  <div className="checkoutInfoCard">
    <Truck className="checkoutIcon" size={20} />

    <div>
      <h4>Fast Delivery</h4>
      <p>Usually delivered within 2–4 days.</p>
    </div>
  </div>

  <div className="checkoutInfoCard">
    <RotateCcw className="checkoutIcon" size={20} />

    <div>
      <h4>Easy Returns</h4>
      <p>7-day hassle-free return policy.</p>
    </div>
  </div>

  <div className="checkoutInfoCard">
    <CreditCard className="checkoutIcon" size={20} />

    <div>
      <h4>Secure Payments</h4>
      <p>UPI • Cards • Net Banking</p>
    </div>
  </div>

</div>
    </div>
  );
}