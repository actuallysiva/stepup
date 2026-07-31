import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSellerOrders, updateOrderStatus } from './api';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';
import SellerLayout from './layouts/SellerLayout';

export default function CurrentOrders() {
  const navigate = useNavigate();
  const { seller } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    if (!seller?.sellerid) return;
    try {
      const data = await getSellerOrders(seller.sellerid);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!seller?.sellerid) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [seller, navigate]);

  const handleStatus = async (orderId, order_status) => {
    try {
      await updateOrderStatus(orderId, order_status);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="statusMsg">Loading orders...</p>;

  return (
    <SellerLayout>
      <div className="availableContainer">
        <div className="availableHeader">
          <h2>Current Orders</h2>
          <button type="button" onClick={() => navigate('/dashboardseller')}>Back to Dashboard</button>
        </div>

        {error && <p className="statusMsg error">{error}</p>}

        {!orders.length ? (
          <p className="statusMsg">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div className="orderItem" key={order.order_id}>
              <div className="orderDetails">
                <h3>Order {order.order_id}</h3>
                <p>Buyer : {order.buyer_name}</p>
                <p>Mobile : {order.buyer_phone}</p>
                <p>Status : {order.order_status}</p>
                <p>Total : {formatPrice(order.totalamount)}</p>
                {order.items?.map((item) => (
                  <p key={item.orderitem_id}>
                    {item.prod_name} — Size {item.size}, {item.color} × {item.quantity}
                  </p>
                ))}
                <div className="actionButtons">
                  <button type="button" onClick={() => handleStatus(order.order_id, 'Packed')}>Mark Packed</button>
                  <button type="button" onClick={() => handleStatus(order.order_id, 'Shipped')}>Mark Shipped</button>
                  <button type="button" onClick={() => handleStatus(order.order_id, 'Delivered')}>Mark Delivered</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </SellerLayout>
  );
}
