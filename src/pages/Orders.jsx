import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Package, Search, ChevronRight } from 'lucide-react';
import './Orders.css';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [myOrders, setMyOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      fetchMyOrders(user.email);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchMyOrders = async (email) => {
    setIsLoading(true);
    try {
      if (!db || !email) return;
      const q = query(
        collection(db, 'orders'),
        where('customerInfo.email', '==', email)
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by date descending
      ordersData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setMyOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="orders-page">
      <div className="container orders-container">
        
        <div className="orders-header">
          <h1>Order History</h1>
          <p>View your past orders and check their status.</p>
        </div>

        <div className="track-guest-card">
          <div className="track-guest-content">
            <Search size={24} className="track-icon" />
            <div>
              <h3>Have an Order ID?</h3>
              <p>You can track any order by its ID, even if you ordered as a guest.</p>
            </div>
          </div>
          <Link to="/track" className="btn-secondary track-link">Track Your Order</Link>
        </div>

        {!user ? (
          <div className="orders-empty-state">
            <Package size={48} color="#ccc" />
            <h2>Please log in</h2>
            <p>You need to be logged in to view your order history.</p>
            <div className="empty-actions">
              <Link to="/login" className="btn-primary">Log In</Link>
              <Link to="/signup" className="btn-secondary">Sign Up</Link>
            </div>
          </div>
        ) : isLoading ? (
          <div className="orders-loading">Loading your orders...</div>
        ) : myOrders.length === 0 ? (
          <div className="orders-empty-state">
            <Package size={48} color="#ccc" />
            <h2>No orders yet</h2>
            <p>When you place orders, they will appear here.</p>
            <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {myOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id-date">
                    <h3>Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                    <span className="order-date">
                      {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                    </span>
                  </div>
                  <div className="order-status-badge">
                    {order.status || 'Paid'}
                  </div>
                </div>
                
                <div className="order-items-preview">
                  {order.items?.map(item => (
                    <div key={item.id} className="order-item-row">
                      <div className="item-details-left">
                        <div className="item-thumb">
                          {item.image ? <img src={item.image} alt={item.name} /> : <div className="placeholder-img" />}
                        </div>
                        <div className="item-name-qty">
                          <span className="name">{item.name}</span>
                          <span className="qty">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="price">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="order-card-footer">
                  <div className="order-total">
                    Total: <span>Rs. {order.pricing?.total?.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/track?id=${order.id}`)}
                    className="track-btn-small"
                  >
                    Track Order <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
