import { useNavigate } from 'react-router-dom';
import SellerLayout from './layouts/SellerLayout';
import successIcon from './assets/success.png';

import "./styles/success-stock.css";

import {
    PackagePlus,
    Boxes,
    LayoutDashboard
} from "lucide-react";
export default function SuccessStock() {
  const navigate = useNavigate();

return (

<SellerLayout>

<div className="successContainer">

<div className="successStockCard">

<div className="imageContainer">

<img
src={successIcon}
alt="Upload Successful"
/>

</div>

<h2>Inventory Updated</h2>

<p className="sellerSubtitle">

Your product has been added to your inventory successfully.

</p>

<div className="successFeatures">

<div>

<PackagePlus size={18}/>

<span>Upload another product</span>

</div>

<div>

<Boxes size={18}/>

<span>View available inventory</span>

</div>

<div>

<LayoutDashboard size={18}/>

<span>Return to Seller Dashboard</span>

</div>

</div>

<div className="successButtons">

<button
type="button"
className="sellerRegisterBtn"
onClick={() => navigate('/uploadstock')}
>

Upload Another

</button>

<button
type="button"
className="secondaryBtn"
onClick={() => navigate('/inventory')}
>

View Inventory

</button>

<button
type="button"
className="secondaryBtn"
onClick={() => navigate('/dashboardseller')}
>

Dashboard

</button>

</div>

</div>

</div>

</SellerLayout>

);
}
