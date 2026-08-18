import { useEffect, useState } from 'react';
import SellerLayout from './layouts/SellerLayout';
import { useNavigate } from 'react-router-dom';
import { getSellerDashboard } from './api';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';
import {
  Package,
  IndianRupee,
  ShoppingBag,
  ArrowRight,
  CalendarDays,
  Store,
} from "lucide-react";



export default function Dashboard() {
  const navigate = useNavigate();
  const { seller, logoutSeller } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!seller?.sellerid) {
      navigate('/signin');
      return;
    }
    getSellerDashboard(seller.sellerid)
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [seller, navigate]);

  const handleLogout = () => {
    logoutSeller();
    navigate('/signin');
  };

  if (loading) return <p className="statusMsg">Loading dashboard...</p>;

  const info = stats?.seller || seller;

  return (
    <SellerLayout>
      <div className="dashboardPage">
        <div className="dashboardContainer">
          <div className="dashboardDetails">

    <div>

        <h2>Welcome back, {info?.name} 👋</h2>

        <h4>{info?.shopname}</h4>

        <p>
            Manage inventory, monitor orders and grow your business.
        </p>

    </div>

    <div className="dashboardDate">

        <CalendarDays size={20}/>

        <span>
            {new Date().toLocaleDateString("en-IN",{
                day:"numeric",
                month:"long",
                year:"numeric"
            })}
        </span>

    </div>

</div>

          {error && <p className="statusMsg error">{error}</p>}

          <div className="statsGrid">

    <div className="statCard">

        <div className="statIcon ordersIcon">
            <ShoppingBag size={24}/>
        </div>

        <h5>Total Orders</h5>

        <p>{stats?.total_orders ?? 0}</p>

    </div>

    <div className="statCard">

        <div className="statIcon stockIcon">
            <Package size={24}/>
        </div>

        <h5>Available Stock</h5>

        <p>{stats?.available_stock ?? 0}</p>

    </div>

    <div className="statCard">

        <div className="statIcon revenueIcon">
            <IndianRupee size={24}/>
        </div>

        <h5>Total Revenue</h5>

        <p>{formatPrice(stats?.total_revenue || 0)}</p>

    </div>

</div>

         <div className="actionSection">

<button
    onClick={()=>navigate("/current-orders")}
>

    <div>

        <h3>Orders</h3>

        <p>View and manage customer orders</p>

    </div>

    <ArrowRight size={22}/>

</button>

<button
    onClick={()=>navigate("/inventory")}
>

    <div>

        <h3>Inventory</h3>

        <p>Check available stock</p>

    </div>

    <ArrowRight size={22}/>

</button>

<button
    onClick={()=>navigate("/uploadstock")}
>

    <div>

        <h3>Upload Products</h3>

        <p>Add new shoes to your catalogue</p>

    </div>

    <ArrowRight size={22}/>

</button>

<button
    onClick={()=>navigate("/password-change")}
>

    <div>

        <h3>Security</h3>

        <p>Update your password</p>

    </div>

    <ArrowRight size={22}/>

</button>

</div>
<div className="activityCard">

    <h3>

        <Store size={20}/>

        Recent Activity

    </h3>

    <p>

        Your recent orders, stock updates and sales
        will appear here.

    </p>

</div>
        </div>
      </div>
    </SellerLayout>
  );
}
