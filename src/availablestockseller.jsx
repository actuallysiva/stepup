import SellerLayout from "./layouts/SellerLayout";

export default function AvailableStock(){

    return(

        <SellerLayout>

            <div>


        <div className="availableContainer">

            {/* PAGE HEADER */}

            <div className="availableHeader">

                <h2>Available Inventory</h2>

                <button>
                    Upload Stock
                </button>

            </div>

            {/* SUMMARY */}

            <div className="stockSummary">

                <div className="summaryCard">

                    <h4>Total Products</h4>

                    <p>120</p>

                </div>

                <div className="summaryCard">

                    <h4>Total Units</h4>

                    <p>650</p>

                </div>

                <div className="summaryCard">

                    <h4>Low Stock</h4>

                    <p>8</p>

                </div>

            </div>

            {/* SEARCH */}

            <div className="availableSearch">

                <input
                    type="text"
                    placeholder="Search Product"
                />

                <button>
                    Search
                </button>

            </div>

            {/* INVENTORY TABLE */}

            <div className="inventoryTable">

                <div className="tableHeader">

                    <span>Image</span>

                    <span>Name</span>

                    <span>Category</span>

                    <span>Size</span>

                    <span>Color</span>

                    <span>Quantity</span>

                    <span>Status</span>

                    <span>Actions</span>

                </div>

                <div className="tableRow">

                    <img
                        src=""
                        alt="shoe"
                    />

                    <span>Running Shoe</span>

                    <span>Men</span>

                    <span>9</span>

                    <span>White</span>

                    <span>24</span>

                    <span className="inStock">
                        In Stock
                    </span>

                    <div className="actionButtons">

                        <button>Edit</button>

                        <button>Delete</button>

                    </div>

                </div>

            </div>

        </div>
            </div>

        </SellerLayout>

    );
}