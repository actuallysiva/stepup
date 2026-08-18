import SellerSidebar from "../seller-sidebar";
import "../styles/seller-layout.css";

export default function SellerLayout({ children }) {

    return (

        <div className="sellerLayout">

            <SellerSidebar />

            <main className="sellerContent">

                {children}

            </main>

        </div>

    );

}