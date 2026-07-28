
import { useNavigate } from "react-router-dom";

export default function Details() {
    const navigate = useNavigate();
    return (


        <div className="detailsPage">

            {/* LEFT SIDE */}

            <div className="imageCard">

                <img
                    src=""
                    alt="shoe"
                />

            </div>

            {/* RIGHT SIDE */}

            <div className="productDetails">

                <div className="productTitle">

                    <h2>Urban Running Shoe</h2>

                    <p className="rating">
                        ★★★★☆ (124 Reviews)
                    </p>

                </div>

                {/* DESCRIPTION */}

                <div className="description">

                    <p>
                        Premium lightweight running shoe
                        designed for comfort and durability.
                    </p>

                </div>

                {/* SIZE */}

                <div className="selectSize">

                    <h3>Select Size</h3>

                    <div className="buttonGroup">

                        <button>5</button>
                        <button>6</button>
                        <button>7</button>
                        <button>8</button>
                        <button>9</button>
                        <button>10</button>
                        <button>11</button>
                        <button>12</button>

                    </div>

                </div>

                {/* COLOR */}

                <div className="selectColor">

                    <h3>Select Color</h3>

                    <div className="buttonGroup">

                        <button>White</button>
                        <button>Black</button>
                        <button>Red</button>
                        <button>Blue</button>

                    </div>

                </div>

                {/* STOCK */}

                <div className="stockStatus">

                    <h4>In Stock</h4>

                </div>

                {/* PRICE */}

                <div className="price">

                    <h2>₹ 1000</h2>

                </div>

                {/* ACTIONS */}

                <div className="proceed">

                    <button onClick={()=>navigate(`/verification/`)}>Buy Now</button>

                    <button onClick={()=>navigate('/cart/')}>Add to Cart</button>

                </div>

            </div>

        </div>

    );
}