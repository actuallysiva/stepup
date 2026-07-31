import { useEffect, useState } from 'react';
import SellerLayout from './layouts/SellerLayout';
import { useNavigate } from 'react-router-dom';
import { getSellerDashboard } from './api';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();
  const { seller, logoutSeller } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!seller?.sellerid) {
      navigate('/login');
      return;
    }
    getSellerDashboard(seller.sellerid)
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [seller, navigate]);

  const handleLogout = () => {
    logoutSeller();
    navigate('/login');
  };

  if (loading) return <p className="statusMsg">Loading dashboard...</p>;

  const info = stats?.seller || seller;

  return (
    <SellerLayout>
      <div className="dashboardPage">
        <div className="dashboardContainer">
          <div className="dashboardDetails">
            <h2>Dashboard</h2>
            <h4>Name : {info?.name}</h4>
            <h4>Shop Name : {info?.shopname}</h4>
          </div>

          {error && <p className="statusMsg error">{error}</p>}

          <div className="statsGrid">
            <div className="statCard"><h5>Total Orders</h5><p>{stats?.total_orders ?? 0}</p></div>
            <div className="statCard"><h5>Available Stock</h5><p>{stats?.available_stock ?? 0}</p></div>
            <div className="statCard"><h5>Total Revenue</h5><p>{formatPrice(stats?.total_revenue || 0)}</p></div>
          </div>

          <div className="actionSection">
            <button type="button" onClick={() => navigate('/current-orders')}>Current Orders</button>
            <button type="button" onClick={() => navigate('/availablestockseller')}>Check Inventory</button>
            <button type="button" onClick={() => navigate('/uploadstock')}>Upload Products</button>
            <button type="button" onClick={() => navigate('/password-change')}>Change Password</button>
            <button type="button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
