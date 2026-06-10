import SellerLayout from "./layouts/SellerLayout";
import { useNavigate } from "react-router-dom";
export default function Dashboard(){
    const navigate = useNavigate();
    return(

        <SellerLayout>

            <div>

                
        <div className="dashboardPage">

            {/* SIDEBAR */}

             <div className="sidebar">

                <h2 className="logo">
                    StepUp
                </h2>

                <button>Dashboard</button>

                <button>Orders</button>

                <button>Products</button>

                <button onClick={()=>navigate('/uploadStock/')}>Upload Stock</button>

                <button>Analytics</button>

                <button>Settings</button>

                <button onClick={()=>navigate('/login/')}>Logout</button>

            </div> */

            {/* MAIN CONTENT */}

            <div className="dashboardContainer">

                {/* PROFILE */}

                <div className="dashboardDetails">

                    <h2>Dashboard</h2>

                    <h4>Name : John</h4>

                    <h4>Shop Name : Urban Shoes</h4>

                </div>

                {/* STATS */}

                <div className="statsGrid">

                    <div className="statCard">
                        <h5>Total Orders</h5>
                        <p>120</p>
                    </div>

                    <div className="statCard">
                        <h5>Available Stock</h5>
                        <p>320</p>
                    </div>

                    <div className="statCard">
                        <h5>Daily Income</h5>
                        <p>₹ 4,500</p>
                    </div>

                    <div className="statCard">
                        <h5>Monthly Income</h5>
                        <p>₹ 85,000</p>
                    </div>

                </div>

                {/* ACTIONS */}

                <div className="actionSection">

                    <button>Current Orders</button>

                    <button onClick={()=>navigate('/availablestockseller/')}>Check Inventory</button>

                    <button>Upload Products</button>

                </div>

            </div>

        </div>

            </div>

        </SellerLayout>

    );
}