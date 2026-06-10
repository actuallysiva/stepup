export default function SellerLayout({children}){

    return(

        <div className="sellerPage">

       {/*     <div className="sellerSidebar">

                <h2>StepUP</h2>

                <button>Dashboard</button>

                <button>Available Stock</button>

                <button>Upload Stock</button>

                <button>Current Orders</button>

                <button>Analytics</button>

                <button>Profile</button>

                <button>Logout</button>

            </div> */}

            <div className="sellerContent">

                {children}

            </div>

        </div>

    );
}