import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setStatus({ type: 'loading', message: 'Subscribing...' });
      await addDoc(collection(db, 'subscribers'), {
        email,
        subscribedAt: serverTimestamp()
      });
      setStatus({ type: 'success', message: 'Thanks for subscribing!' });
      setEmail('');
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus({ type: 'error', message: 'Failed to subscribe. Try again.' });
    }
  };

  if (location.pathname !== '/') {
    return null;
  }

  return (
    <footer className="footer">
      {/* Newsletter */}
      <div className="footer-newsletter">
        <div className="container newsletter-inner">
          <div className="newsletter-left">
            <span className="newsletter-eyebrow">Stay in the Loop</span>
            <h3 className="newsletter-title">Bablu Resin Arts</h3>
          </div>
          <div className="newsletter-right">
            <p className="newsletter-text">Subscribe for exclusive offers, early access, and curated style inspiration.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email address" 
                required 
                className="newsletter-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status.type === 'loading'}
              />
              <button type="submit" className="newsletter-btn" disabled={status.type === 'loading'}>
                {status.type === 'loading' ? 'Wait...' : 'Subscribe'}
              </button>
            </form>
            {status.message && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: status.type === 'error' ? '#ff6b6b' : '#a8e6cf' }}>
                {status.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h2 className="footer-logo">Bablu<span className="footer-logo-accent">ResinArts</span></h2>
              <p className="footer-desc">
                Curating the finest luxury accessories, handcrafted jewelry, and lifestyle products for the modern sophisticate.
              </p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <h4 className="footer-heading">Shop</h4>
              <ul>
                <li><Link to="/shop">Shop All</Link></li>
                <li><Link to="/category/necklaces">Necklaces</Link></li>
                <li><Link to="/category/earrings">Earrings</Link></li>
                <li><Link to="/category/bracelets">Bracelets</Link></li>
                <li><Link to="/category/gifts">Gifts</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4 className="footer-heading">Help</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/legal/shipping-policy">Shipping Policy</Link></li>
                <li><Link to="/legal/refund-policy">Refunds & Returns</Link></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><Link to="/track">Track Order</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4 className="footer-heading">About</h4>
              <ul>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Careers</a></li>
                <li><Link to="/legal/terms-of-service">Terms of Service</Link></li>
                <li><Link to="/legal/privacy-policy">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} Bablu Resin Arts. All rights reserved.</p>
          <div className="payment-methods">
            <span>Visa</span>
            <span className="pay-divider">·</span>
            <span>Mastercard</span>
            <span className="pay-divider">·</span>
            <span>UPI</span>
            <span className="pay-divider">·</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
