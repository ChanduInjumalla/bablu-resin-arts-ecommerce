import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Pencil, Truck, Ticket } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart,
    deliveryCharge,
    calculateSubtotal
  } = useContext(ShopContext);
  const navigate = useNavigate();

  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <>
      <div 
        className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} 
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>Shopping Cart</h2>
          <button className="close-cart-btn" onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              Your cart is currently empty.
            </div>
          ) : (
            <div className="cart-drawer-items">
              {cartItems.map(item => (
                <div key={item.id} className="drawer-item">
                  <div className="drawer-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="drawer-item-details">
                    <h4 className="drawer-item-name">{item.name}</h4>
                    <p className="drawer-item-price">Rs. {item.price.toFixed(2)}</p>
                    <div className="drawer-item-actions">
                      <div className="drawer-quantity-selector">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                      </div>
                      <button className="drawer-item-remove" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">

            <div className="drawer-subtotal">
              <span>Subtotal</span>
              <span className="subtotal-amount">Rs. {calculateSubtotal().toFixed(2)}</span>
            </div>
            
            {deliveryCharge !== null && (
              <div className="drawer-delivery">
                <span>Delivery Charge</span>
                <span className="delivery-amount">
                  {deliveryCharge === 0 ? 'FREE' : `Rs. ${deliveryCharge.toFixed(2)}`}
                </span>
              </div>
            )}

            <div className="drawer-total">
              <span>Total</span>
              <span className="total-amount">
                Rs. {(calculateSubtotal() + (deliveryCharge || 0)).toFixed(2)}
              </span>
            </div>
            
            <p className="drawer-taxes-note">Taxes calculated at checkout</p>

            <button className="drawer-checkout-btn" onClick={handleCheckout}>
              Check out
            </button>
            
            <button className="drawer-view-cart-btn" onClick={handleViewCart}>
              View Cart
            </button>

            <div className="drawer-trust-badge">
              <div className="trust-badge-row-top">
                <span className="trust-text">100% SECURE PAYMENTS POWERED BY</span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="payment-logo razorpay" />
              </div>
              <div className="trust-badge-row-bottom">
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="G Pay" className="payment-logo gpay" />
                <span className="trust-divider"></span>
                <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" className="payment-logo phonepe" />
                <span className="trust-divider"></span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="payment-logo upi" />
                <span className="trust-divider"></span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="payment-logo paypal" />
                <span className="trust-divider"></span>
                <div className="netbanking-logo">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d2366" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="7"></rect><path d="M12 2v6"></path></svg>
                  <span>Net Banking</span>
                </div>
                <span className="trust-divider"></span>
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="payment-logo paytm" />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
