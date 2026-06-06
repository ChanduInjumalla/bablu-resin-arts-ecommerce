import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, LogOut, Shield, Edit2, Check, X, Package } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import './Profile.css';

const Profile = () => {
  const { user, logoutUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  const [myOrders, setMyOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      fetchMyOrders(user.email);
    }
  }, [user]);

  const fetchMyOrders = async (email) => {
    setIsLoadingOrders(true);
    try {
      if (!db || !email) return;
      const q = query(
        collection(db, 'orders'),
        where('customerInfo.email', '==', email),
        // Note: orderBy requires an index if used with where. To keep it simple without forcing the user to create an index, we fetch and sort in JS.
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
      setIsLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    await updateUserProfile(editName, editPhone);
    setIsEditing(false);
  };

  const isGuest = user.email !== 'admin@babluresinarts.com';

  return (
    <div className="profile-page">
      <div className="container profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              <User size={40} color="var(--brand-dark)" />
            </div>
            <h3>{user.name || (isGuest ? 'Guest User' : 'Store Admin')}</h3>
            <p>{user.role.toUpperCase()}</p>
          </div>
          
          <ul className="profile-nav">
            <li className="active"><User size={18} /> My Profile</li>
            <li onClick={handleLogout} className="logout-btn"><LogOut size={18} /> Logout</li>
          </ul>
        </div>
        
        <div className="profile-main">
          <div className="profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>Personal Information</h2>
              <p>Manage your account details and preferences.</p>
            </div>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer' }}>
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#f8f9fa', cursor: 'pointer' }}>
                  <X size={16} /> Cancel
                </button>
                <button onClick={handleSaveProfile} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', borderRadius: '4px', border: 'none', background: 'var(--brand-dark)', color: 'white', cursor: 'pointer' }}>
                  <Check size={16} /> Save
                </button>
              </div>
            )}
          </div>
          
          <div className="profile-details">
            <div className="detail-item">
              <div className="detail-icon"><User size={20} /></div>
              <div className="detail-content">
                <label>Full Name</label>
                {isEditing ? (
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ padding: '8px', marginTop: '4px', width: '100%', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                ) : (
                  <p>{user.name || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon"><Mail size={20} /></div>
              <div className="detail-content">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>
            </div>
            
            <div className="detail-item">
              <div className="detail-icon"><Phone size={20} /></div>
              <div className="detail-content">
                <label>Phone Number</label>
                {isEditing ? (
                  <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={{ padding: '8px', marginTop: '4px', width: '100%', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                ) : (
                  <p>{user.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {user.role === 'admin' && (
            <div className="admin-access-card" style={{ marginTop: '2rem' }}>
              <div className="admin-access-info">
                <Shield size={24} color="var(--brand-accent)" />
                <div>
                  <h3>Administrator Access</h3>
                  <p>You have full access to manage the store's products, categories, and inventory.</p>
                </div>
              </div>
              <Link to="/admin/dashboard" className="btn-primary admin-dashboard-link">
                <span>Go to Admin Dashboard</span>
              </Link>
            </div>
          )}

          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--brand-dark)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>My Orders</h2>
            
            {isLoadingOrders ? (
              <p style={{ color: '#666' }}>Loading your orders...</p>
            ) : myOrders.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', background: '#f8f9fa', borderRadius: '8px' }}>
                <Package size={40} color="#ccc" style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: '0 0 0.5rem', color: '#333' }}>No orders yet</h3>
                <p style={{ margin: 0, color: '#666' }}>When you place orders, they will appear here.</p>
                <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>Start Shopping</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myOrders.map(order => (
                  <div key={order.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', background: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Order #{order.id.slice(0, 8).toUpperCase()}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                          Placed on: {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}
                        </div>
                      </div>
                      <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {order.status || 'Paid'}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {order.items?.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                          <span>{item.quantity}x {item.name}</span>
                          <span>Rs. {item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                      <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Total: Rs. {order.pricing?.total?.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
