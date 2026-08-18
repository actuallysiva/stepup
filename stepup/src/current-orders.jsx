import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSellerOrders, updateOrderStatus } from './api';
import { useApp } from './context/AppContext';
import { formatPrice } from './utils/helpers';
import SellerLayout from './layouts/SellerLayout';


import "./styles/current-orders.css";

import {
    ShoppingBag,
    User,
    Phone,
    IndianRupee,
    Truck,
    PackageCheck,
    CircleCheckBig,
    Clock3
} from "lucide-react";

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
      navigate('/signin');
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
        <div className="ordersHeader">

<div>

<h1>

Current Orders

</h1>

<p>

Manage customer orders and shipping status.

</p>

</div>

</div>

        {error && <p className="statusMsg error">{error}</p>}

        {!orders.length ? (
<div className="emptyOrders">

<ShoppingBag size={52}/>

<h2>

No Orders Yet

</h2>

<p>

Orders from customers will appear here.

</p>

</div>        ) : (
  orders.map((order) => (
<div className="orderCard" key={order.order_id}>

  <div className="orderTop">

    <div>

      <h2>#{order.order_id}</h2>

<span className={`statusBadge ${order.order_status.toLowerCase()}`}>

  {order.order_status === "Pending" && (
    <>
      <Clock3 size={15}/>
      Pending
    </>
  )}

  {order.order_status === "Packed" && (
    <>
      <PackageCheck size={15}/>
      Packed
    </>
  )}

  {order.order_status === "Shipped" && (
    <>
      <Truck size={15}/>
      Shipped
    </>
  )}

  {order.order_status === "Delivered" && (
    <>
      <CircleCheckBig size={15}/>
      Delivered
    </>
  )}

</span>

    </div>

    <div className="orderPrice">

      <IndianRupee size={18} />

      {formatPrice(order.totalamount)}

    </div>

  </div>
                <div className="customerInfo">

  <div>

    <User size={18} />

    <span>{order.buyer_name}</span>

  </div>

  <div>

    <Phone size={18} />

    <span>{order.buyer_phone}</span>

  </div>

</div>
              <div className="orderedProducts">

  {order.items?.map((item) => (

    <div className="orderedItem" key={item.orderitem_id}>

      <h4>{item.prod_name}</h4>

      <p>

        UK {item.size} • {item.color} • Qty {item.quantity}

      </p>

    </div>

  ))}

</div>
<div className="orderActions">

  {order.order_status === "Pending" && (

    <button
      type="button"
      onClick={() => handleStatus(order.order_id, "Packed")}
    >
      <PackageCheck size={18}/>
      Mark Packed
    </button>

  )}

  {order.order_status === "Packed" && (

    <button
      type="button"
      onClick={() => handleStatus(order.order_id, "Shipped")}
    >
      <Truck size={18}/>
      Mark Shipped
    </button>

  )}

  {order.order_status === "Shipped" && (

    <button
      type="button"
      onClick={() => handleStatus(order.order_id, "Delivered")}
    >
      <CircleCheckBig size={18}/>
      Mark Delivered
    </button>

  )}

  {order.order_status === "Delivered" && (

    <div className="completedOrder">

      <CircleCheckBig size={18}/>

      Order Completed

    </div>

  )}

</div>
              </div>
          ))
        )}
        </div>
    </SellerLayout>
  );
}
