import CheckoutSteps from "./step-component.jsx";

export default function Success(){

    return(

        <div className="checkoutLayout">

            <CheckoutSteps step={4}/>

            <div className="checkoutContent">

                <div className="successContainer">

            <div className="greetings">

                <div className="imageContainer">

                    <img
                        src=""
                        alt="Success"
                    />

                </div>

                <h3>
                    YAY!! Your order is confirmed
                    and scheduled for delivery
                </h3>

                <h5>
                    Your order will be delivered
                    on/before Saturday
                </h5>

                <a href="">
                    Click here for Order Summary
                </a>

            </div>

        </div>


            </div>

        </div>

    );
}