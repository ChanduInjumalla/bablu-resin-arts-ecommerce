import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchOrder = async () => {
      try {
        if (!id || !db) throw new Error("Invalid order parameters");
        
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="order-confirmation-page loading">
        <div className="loader-spinner"></div>
        <p>Loading your receipt...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation-page error">
        <h2>Oops! {error}</h2>
        <p>We couldn't find the details for this order. It might have been deleted or the ID is incorrect.</p>
        <Link to="/shop" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container confirmation-container">
        <div className="success-header">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h1>Thank you for your purchase!</h1>
          <p>Your order <strong>#{order.id.slice(0, 8).toUpperCase()}</strong> has been confirmed.</p>
          <p className="email-note">We'll send you shipping updates to {order.customerInfo?.email}.</p>
        </div>

        <div className="confirmation-grid">
          <div className="confirmation-details">
            <div className="detail-section">
              <h3>Shipping Address</h3>
              <p className="customer-name">{order.customerInfo?.firstName} {order.customerInfo?.lastName}</p>
              <p>{order.shippingAddress?.address}</p>
              {order.shippingAddress?.apartment && <p>{order.shippingAddress?.apartment}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
              <p>{order.shippingAddress?.country}</p>
              <p className="phone">Phone: {order.customerInfo?.phone}</p>
            </div>

            <div className="detail-section">
              <h3>Payment Method</h3>
              <p>{order.paymentMethod}</p>
              <p>Status: <span className="status-badge">{order.status}</span></p>
            </div>
            
            <div className="track-promo">
              <Package size={24} />
              <div>
                <h4>Track Your Package</h4>
                <p>You can track the status of your order at any time using your Order ID.</p>
              </div>
              <button onClick={() => navigate('/track')} className="btn-secondary track-btn">
                Go to Tracking
              </button>
            </div>
          </div>

          <div className="confirmation-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {order.items?.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-img-wrapper">
                    <img src={item.image} alt={item.name} />
                    <span className="item-qty-badge">{item.quantity}</span>
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                  </div>
                  <div className="item-price">
                    Rs. {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>Rs. {order.pricing?.subtotal?.toFixed(2)}</span>
              </div>
              {order.pricing?.discount > 0 && (
                <div className="total-row discount">
                  <span>Discount</span>
                  <span>- Rs. {order.pricing.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row">
                <span>Shipping</span>
                <span>{order.pricing?.deliveryCharge === 0 ? 'Free' : `Rs. ${order.pricing?.deliveryCharge?.toFixed(2)}`}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>Rs. {order.pricing?.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/shop" className="continue-shopping">
            Continue Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
