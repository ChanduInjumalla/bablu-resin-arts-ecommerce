import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="cart-page" style={{ minHeight: '60vh', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">Shopping Cart</h1>
          <p className="section-subtitle">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="cart-layout" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div className="cart-items" style={{ flex: '1 1 60%' }}>
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div className="cart-item-details" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</p>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: '0.3rem 0', color: 'var(--brand-dark)' }}>{item.name}</h3>
                        <p style={{ fontWeight: '600', color: 'var(--brand-dark)', marginTop: '0.5rem' }}>Rs. {item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#a0a0a0', cursor: 'pointer', padding: '0.5rem' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                    
                    <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.4rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                        <span style={{ padding: '0 0.8rem', fontSize: '0.9rem', minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.4rem 0.6rem', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                      </div>
                      <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>Rs. {item.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary" style={{ flex: '1 1 30%', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', alignSelf: 'flex-start', position: 'sticky', top: '120px' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary</h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>Rs. {calculateSubtotal()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{calculateSubtotal() > 1500 ? 'Free' : 'Calculated at checkout'}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontWeight: '600', fontSize: '1.2rem' }}>
                <span>Total</span>
                <span>Rs. {calculateSubtotal()}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                style={{ width: '100%', padding: '1rem', backgroundColor: 'var(--brand-dark)', color: 'white', border: 'none', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500', cursor: 'pointer' }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--brand-dark)' }}>Your cart is empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '1rem 2rem', backgroundColor: 'var(--brand-dark)', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Continue Shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
