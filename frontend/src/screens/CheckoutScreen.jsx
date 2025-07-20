import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutScreen.css'; // Add this CSS file

const CheckoutScreen = () => {
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const calculatePrices = () => {
    if (!Array.isArray(cartItems)) return { itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 };

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = 0.18 * itemsPrice;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices();

  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders`,
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        config
      );

      localStorage.removeItem('cartItems');
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error('Order creation failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Shipping Info</h2>
      <div className="form-group">
        <input placeholder="Address" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} />
        <input placeholder="City" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} />
        <input placeholder="Postal Code" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} />
        <input placeholder="Country" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} />
      </div>

      <h2>Payment</h2>
      <div className="form-group">
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="Cash on Delivery">Cash on Delivery</option>
          <option value="PayPal">PayPal</option>
        </select>
      </div>

      <h3>Order Summary</h3>
      <div className="summary">
        <p><strong>Items:</strong> ₹{itemsPrice.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ₹{shippingPrice.toFixed(2)}</p>
        <p><strong>Tax:</strong> ₹{taxPrice.toFixed(2)}</p>
        <p><strong>Total:</strong> ₹{totalPrice.toFixed(2)}</p>
      </div>

      <button className="place-order-btn" onClick={placeOrderHandler}>Place Order</button>
    </div>
  );
};

export default CheckoutScreen;
