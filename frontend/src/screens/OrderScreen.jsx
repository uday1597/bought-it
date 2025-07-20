import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderScreen.css'; // Importing the CSS file

const OrderScreen = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setOrder(data);
    };
    fetchOrder();
  }, [id, userInfo.token]);

  if (!order) return <p className="loading">Loading...</p>;

  return (
    <div className="order-container">
      <h1 className="order-title">Order #{order._id}</h1>
      <div className="order-info">
        <p><strong>Total:</strong> ₹{order.totalPrice}</p>
        <p><strong>Shipping To:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
      </div>

      <h4 className="item-header">Items:</h4>
      <div className="order-items">
        {order.orderItems.map((item) => (
          <div key={item.product} className="order-item">
            <span>{item.qty} × {item.name}</span>
            <span>= ₹{item.qty * item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderScreen;
