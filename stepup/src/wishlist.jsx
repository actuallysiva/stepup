export default function Wishlist(){

    return(

        <div className="wishlistContainer">

            <div className="wishlistHeader">

                <h1>My Wishlist</h1>

                <h4>
                    4 Saved Items
                </h4>

            </div>

            <div className="wishlistGrid">

                <div className="wishlistCard">

                    <img
                        src=""
                        alt="Product"
                    />

                    <div className="wishlistDetails">

                        <h3>Nike Air Max</h3>

                        <p>Men Running Shoe</p>

                        <h4>₹ 4,999</h4>

                    </div>

                    <div className="wishlistActions">

                        <button className="moveBtn">
                            Move To Cart
                        </button>

                        <button className="removeBtn">
                            Remove
                        </button>

                    </div>

                </div>

                <div className="wishlistCard">

                    <img
                        src=""
                        alt="Product"
                    />

                    <div className="wishlistDetails">

                        <h3>Adidas UltraBoost</h3>

                        <p>Sports Shoe</p>

                        <h4>₹ 5,499</h4>

                    </div>

                    <div className="wishlistActions">

                        <button className="moveBtn">
                            Move To Cart
                        </button>

                        <button className="removeBtn">
                            Remove
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );
}