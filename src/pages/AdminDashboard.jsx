import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShopContext } from '../context/ShopContext';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs, doc, writeBatch, updateDoc, setDoc } from 'firebase/firestore';
import { Trash2, Edit2, LogOut, Package, Plus, CheckCircle, XCircle, ShoppingCart, RefreshCw, Mail, Users, Menu, X } from 'lucide-react';
import defaultProducts from '../data/products.json';
import './AdminDashboard.css';

const CATEGORIES = [
  "Necklaces",
  "Earrings",
  "Bracelets",
  "Keychains",
  "Hair Accessories",
  "Customized Gifts",
  "Beauty Products",
  "Resin Products"
];

const AdminDashboard = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { products, addProduct, updateProduct, deleteProduct } = useContext(ShopContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('list'); // 'list', 'add', 'orders', 'messages', 'subscribers'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  
  const [subscribers, setSubscribers] = useState([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  
  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: CATEGORIES[0],
    price: '',
    originalPrice: '',
    image: '', // Primary image
    outOfStock: false
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'messages') fetchMessages();
    if (activeTab === 'subscribers') fetchSubscribers();
  }, [activeTab]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      if (!db) {
        console.warn("Firestore not initialized.");
        return;
      }
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ordersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders: ", error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating status: ", error);
      alert("Failed to update status.");
    }
  };

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const fetchSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const q = query(collection(db, 'subscribers'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubscribers(subs);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const productToAdd = {
      ...newProduct,
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
      rating: 5.0, // Default rating
      reviews: 0,
      isNew: true
    };
    
    addProduct(productToAdd);
    alert('Product added successfully!');
    setNewProduct({
      name: '',
      category: CATEGORIES[0],
      price: '',
      originalPrice: '',
      image: '',
      outOfStock: false
    });
    setActiveTab('list');
  };

  const toggleOutOfStock = (product) => {
    updateProduct({ ...product, outOfStock: !product.outOfStock });
  };

  const handlePriceChange = (product, newPrice) => {
    const price = Number(newPrice);
    if (!isNaN(price) && price >= 0) {
      updateProduct({ ...product, price });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({...prev, image: reader.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleForceSeed = async () => {
    try {
      if (!db) return alert("Firebase not configured");
      const confirmSeed = window.confirm("This will clear existing products and reset to the default 181 products. Continue?");
      if (!confirmSeed) return;

      const productsRef = collection(db, 'products');
      
      // 1. Fetch and Delete all existing products (in chunks of 500)
      const querySnapshot = await getDocs(productsRef);
      const docsToDelete = querySnapshot.docs;
      for (let i = 0; i < docsToDelete.length; i += 500) {
        const delBatch = writeBatch(db);
        docsToDelete.slice(i, i + 500).forEach(docSnap => {
          delBatch.delete(docSnap.ref);
        });
        await delBatch.commit();
      }

      // 2. Upload the default products
      const productsToSeed = defaultProducts;
      const addBatch = writeBatch(db);
      
      let currentNumber = 1;
      productsToSeed.forEach((prod) => {
        const docRef = doc(productsRef, String(currentNumber));
        addBatch.set(docRef, { ...prod, id: String(currentNumber), productNumber: currentNumber });
        currentNumber++;
      });
      
      // 3. Reset the metadata counter
      const counterRef = doc(db, 'metadata', 'productCounter');
      addBatch.set(counterRef, { count: currentNumber - 1 });
      
      await addBatch.commit();
      alert("Successfully reset database to exactly 181 products! Please refresh the page.");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to seed database: " + error.message);
    }
  };

  const handleInitializeNumbers = async () => {
    try {
      if (!db) return alert("Firebase not configured");
      const confirmInit = window.confirm("This will securely assign sequential numbers (#1, #2, etc.) to all your existing products based on when they were added. It will only run on products that don't have a number yet. Continue?");
      if (!confirmInit) return;

      // 1. Fetch all products
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);
      
      const allProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ref: doc.ref,
        ...doc.data()
      }));

      // Sort existing products by their creation order (or default to name if no date)
      allProducts.sort((a, b) => a.name.localeCompare(b.name));

      // 2. Assign numbers starting from 1
      let currentNumber = 1;
      const initBatch = writeBatch(db);
      
      allProducts.forEach(prod => {
        // Delete the old document with the random ID
        initBatch.delete(prod.ref);
        // Create the new document with the sequential ID
        const newDocRef = doc(db, 'products', String(currentNumber));
        // Remove the old 'ref' before saving, keep the rest
        const { ref, ...cleanProd } = prod;
        initBatch.set(newDocRef, { ...cleanProd, id: String(currentNumber), productNumber: currentNumber });
        currentNumber++;
      });
      
      // 3. Set the metadata counter
      const counterRef = doc(db, 'metadata', 'productCounter');
      initBatch.set(counterRef, { count: currentNumber - 1 });

      await initBatch.commit();
      alert(`Successfully assigned numbers up to #${currentNumber - 1}! Please refresh the page.`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to initialize numbers: " + error.message);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({ ...product });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const price = Number(editingProduct.price);
    if (isNaN(price) || price < 0) return alert("Invalid price");
    
    await updateProduct({ ...editingProduct, price });
    setEditingProduct(null);
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => ({...prev, image: reader.result}));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <h2>Admin Panel</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {isMobileMenuOpen && <div className="admin-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <div className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <h2>Admin Panel</h2>
          <button className="admin-close-mobile" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <ul className="admin-nav">
          <li className={activeTab === 'list' ? 'active' : ''} onClick={() => { setActiveTab('list'); setIsMobileMenuOpen(false); }}>
            <Package size={18} /> Manage Products
          </li>
          <li className={activeTab === 'add' ? 'active' : ''} onClick={() => { setActiveTab('add'); setIsMobileMenuOpen(false); }}>
            <Plus size={18} /> Add New Product
          </li>
          <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}>
            <ShoppingCart size={18} /> Orders
          </li>
          <li className={activeTab === 'messages' ? 'active' : ''} onClick={() => { setActiveTab('messages'); setIsMobileMenuOpen(false); }}>
            <Mail size={18} /> Messages
          </li>
          <li className={activeTab === 'subscribers' ? 'active' : ''} onClick={() => { setActiveTab('subscribers'); setIsMobileMenuOpen(false); }}>
            <Users size={18} /> Subscribers
          </li>
        </ul>
        <div className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>{activeTab === 'list' ? 'Manage Products' : activeTab === 'add' ? 'Add New Product' : 'Recent Orders'}</h1>
          <div className="admin-stats">
            <div className="stat-card">
              <span>Total Products</span>
              <strong>{products.length}</strong>
            </div>
            <div className="stat-card">
              <span>Out of Stock</span>
              <strong>{products.filter(p => p.outOfStock).length}</strong>
            </div>
            <button 
              onClick={handleInitializeNumbers}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                background: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2', 
                padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.85rem'
              }}
            >
              <CheckCircle size={16} /> Initialize Numbers
            </button>
            <button 
              onClick={handleForceSeed}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                background: '#e3f2fd', color: '#1976d2', border: 'none', 
                padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.85rem'
              }}
            >
              <RefreshCw size={16} /> Seed Database
            </button>
          </div>
        </div>

        <div className="admin-content">
          {activeTab === 'add' && (
            <div className="admin-form-card">
              <form onSubmit={handleAddSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input 
                      type="text" 
                      value={newProduct.name} 
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} 
                      required 
                      placeholder="e.g. Gold Plated Rose Necklace"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      value={newProduct.category} 
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (Rs.)</label>
                    <input 
                      type="number" 
                      value={newProduct.price} 
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} 
                      required 
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label>Original Price (Optional Rs.)</label>
                    <input 
                      type="number" 
                      value={newProduct.originalPrice} 
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})} 
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image - Paste a URL OR Upload a File</label>
                  <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                    <input 
                      type="text" 
                      value={newProduct.image.startsWith('data:image') ? 'Local File Uploaded' : newProduct.image} 
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} 
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>— OR —</div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ padding: '0.5rem', border: '1px dashed var(--border-color)' }}
                    />
                  </div>
                  <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>For prototype: Only the first image is used by the UI.</small>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={newProduct.outOfStock} 
                      onChange={(e) => setNewProduct({...newProduct, outOfStock: e.target.checked})}
                    />
                    Mark as Out of Stock
                  </label>
                </div>

                <button type="submit" className="admin-btn-primary">Add Product</button>
              </form>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="admin-table-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>Product Inventory</h3>
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{ padding: '0.6rem 1rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', minWidth: '200px' }}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price (Rs.)</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products
                    .filter(p => filterCategory === 'All' || p.category === filterCategory)
                    .map((product) => (
                    <tr key={product.id}>
                      <td style={{ fontWeight: '600', color: 'var(--brand-dark)' }}>
                        {product.productNumber ? `#${product.productNumber}` : product.id}
                      </td>
                      <td>
                        <img src={product.image.split(',')[0]} alt={product.name} className="admin-table-img" />
                      </td>
                      <td>{product.name}</td>
                      <td><span className="admin-badge">{product.category}</span></td>
                      <td>
                        <input 
                          type="number" 
                          className="admin-inline-input"
                          defaultValue={product.price}
                          onBlur={(e) => handlePriceChange(product, e.target.value)}
                        />
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleOutOfStock(product)}
                          className={`status-btn ${product.outOfStock ? 'status-out' : 'status-in'}`}
                        >
                          {product.outOfStock ? <><XCircle size={14}/> Out of Stock</> : <><CheckCircle size={14}/> In Stock</>}
                        </button>
                      </td>
                      <td>
                        <button 
                          className="action-btn edit-btn" 
                          onClick={() => openEditModal(product)} 
                          title="Edit Product"
                          style={{ color: '#1976d2' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button className="action-btn delete-btn" onClick={() => deleteProduct(product.id)} title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="admin-table-container">
              <h3 style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>Customer Orders</h3>
              {isLoadingOrders ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No orders found yet.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total (Rs.)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: '600', color: 'var(--brand-dark)' }}>
                          {order.id.slice(0, 8).toUpperCase()}...
                        </td>
                        <td>
                          {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                        </td>
                        <td>
                          <div><strong>{order.customerInfo?.firstName} {order.customerInfo?.lastName}</strong></div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                        </td>
                        <td>
                          {order.items?.map(item => (
                            <div key={item.id} style={{ fontSize: '0.85rem' }}>{item.quantity}x {item.name}</div>
                          ))}
                        </td>
                        <td style={{ fontWeight: '600' }}>₹{order.pricing?.total?.toFixed(2)}</td>
                        <td>
                          <select 
                            className="status-dropdown" 
                            value={order.status || 'Paid'} 
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="Paid">Paid</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="admin-list-section">
              <div className="admin-header-actions">
                <h2>Customer Messages</h2>
              </div>
              
              {isLoadingMessages ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading messages...</div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No messages yet.</div>
              ) : (
                <div className="messages-grid">
                  {messages.map(msg => (
                    <div key={msg.id} className="message-card">
                      <div className="message-header">
                        <h4>{msg.name}</h4>
                        <span className="message-date">{msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</span>
                      </div>
                      <a href={`mailto:${msg.email}`} className="message-email">{msg.email}</a>
                      <p className="message-body">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <div className="admin-list-section">
              <div className="admin-header-actions">
                <h2>Newsletter Subscribers</h2>
              </div>
              
              {isLoadingSubscribers ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading subscribers...</div>
              ) : subscribers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No subscribers yet.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Subscribed On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map(sub => (
                      <tr key={sub.id}>
                        <td style={{ fontWeight: '500' }}>{sub.email}</td>
                        <td>{sub.createdAt ? new Date(sub.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal Popup */}
      {editingProduct && (
        <div className="edit-modal-overlay" onClick={closeEditModal}>
          <div className="edit-modal-content" onClick={e => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Product</h2>
              <button className="close-modal-btn" onClick={closeEditModal}><XCircle size={24} /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="admin-form-card" style={{ padding: 0, boxShadow: 'none' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name</label>
                  <input 
                    type="text" 
                    value={editingProduct.name} 
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={editingProduct.category} 
                    onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (Rs.)</label>
                  <input 
                    type="number" 
                    value={editingProduct.price} 
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} 
                    required 
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Original Price (Rs.)</label>
                  <input 
                    type="number" 
                    value={editingProduct.originalPrice || ''} 
                    onChange={(e) => setEditingProduct({...editingProduct, originalPrice: e.target.value})} 
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image - Paste a URL OR Upload a File</label>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <input 
                    type="text" 
                    value={editingProduct.image.startsWith('data:image') ? 'Local File Uploaded' : editingProduct.image} 
                    onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} 
                  />
                  <div style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>— OR —</div>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleEditImageUpload}
                    style={{ padding: '0.5rem', border: '1px dashed var(--border-color)' }}
                  />
                </div>
              </div>

              <div className="form-group checkbox-group" style={{ marginBottom: '1.5rem' }}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={editingProduct.outOfStock} 
                    onChange={(e) => setEditingProduct({...editingProduct, outOfStock: e.target.checked})}
                  />
                  Mark as Out of Stock
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={closeEditModal} style={{ padding: '0.8rem 2rem', background: '#f1f1f1', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
                <button type="submit" className="admin-btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
