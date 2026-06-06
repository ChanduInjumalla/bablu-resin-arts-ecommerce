import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Search, Package, CheckCircle, Truck, MapPin } from 'lucide-react';
import './TrackOrder.css';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    try {
      setStatus({ type: 'loading', message: 'Searching for your order...' });
      setOrder(null);

      // In Firestore, the orderId is the document ID
      const orderRef = doc(db, 'orders', orderId.trim());
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        setOrder({ id: orderSnap.id, ...orderSnap.data() });
        setStatus({ type: '', message: '' });
      } else {
        setStatus({ type: 'error', message: 'Order not found. Please check your Order ID and try again.' });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setStatus({ type: 'error', message: 'Failed to fetch order details. Please ensure you have an internet connection.' });
    }
  };

  const getStatusStep = (orderStatus) => {
    const s = (orderStatus || 'Paid').toLowerCase();
    if (s.includes('deliver')) return 4;
    if (s.includes('ship') || s.includes('transit')) return 3;
    if (s.includes('process') || s.includes('pack')) return 2;
    return 1; // Default: Paid / Ordered
  };

  return (
    <div className="track-order-page">
      <div className="container track-container">
        
        <div className="track-header">
          <h1>Track Your Order</h1>
          <p>Enter your Order ID below to check the current status of your shipment.</p>
        </div>

        <div className="track-search-box">
          <form onSubmit={handleTrack} className="track-form">
            <div className="track-input-wrapper">
              <input 
                type="text" 
                placeholder="e.g. order_PhQf..." 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary track-btn" disabled={status.type === 'loading'}>
                {status.type === 'loading' ? 'Searching...' : <><Search size={18} /> Track</>}
              </button>
            </div>
          </form>
          {status.message && (
            <div className={`track-message ${status.type}`}>
              {status.message}
            </div>
          )}
        </div>

        {order && (
          <div className="track-result">
            <div className="track-result-header">
              <div>
                <h2>Order #{order.id.slice(0, 8).toUpperCase()}</h2>
                <p>Placed on {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}</p>
              </div>
              <div className="track-total">
                Total: Rs. {order.pricing?.total?.toFixed(2)}
              </div>
            </div>

            <div className="track-stepper">
              <div className={`step ${getStatusStep(order.status) >= 1 ? 'completed' : ''}`}>
                <div className="step-icon"><Package size={20} /></div>
                <span>Order Placed</span>
              </div>
              <div className={`step-line ${getStatusStep(order.status) >= 2 ? 'completed' : ''}`}></div>
              <div className={`step ${getStatusStep(order.status) >= 2 ? 'completed' : ''}`}>
                <div className="step-icon"><CheckCircle size={20} /></div>
                <span>Processing</span>
              </div>
              <div className={`step-line ${getStatusStep(order.status) >= 3 ? 'completed' : ''}`}></div>
              <div className={`step ${getStatusStep(order.status) >= 3 ? 'completed' : ''}`}>
                <div className="step-icon"><Truck size={20} /></div>
                <span>Shipped</span>
              </div>
              <div className={`step-line ${getStatusStep(order.status) >= 4 ? 'completed' : ''}`}></div>
              <div className={`step ${getStatusStep(order.status) >= 4 ? 'completed' : ''}`}>
                <div className="step-icon"><MapPin size={20} /></div>
                <span>Delivered</span>
              </div>
            </div>

            <div className="track-details-grid">
              <div className="track-card">
                <h3>Delivery Address</h3>
                <p><strong>{order.customerInfo?.firstName} {order.customerInfo?.lastName}</strong></p>
                <p>{order.shippingAddress?.address}</p>
                {order.shippingAddress?.apartment && <p>{order.shippingAddress?.apartment}</p>}
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
              </div>
              
              <div className="track-card">
                <h3>Items</h3>
                <div className="track-items">
                  {order.items?.map(item => (
                    <div key={item.id} className="track-item">
                      <div className="track-item-img">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="track-item-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
