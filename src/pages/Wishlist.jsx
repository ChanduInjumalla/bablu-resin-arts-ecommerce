import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import { ShopContext } from '../context/ShopContext';

const Wishlist = () => {
  const { wishlistItems } = useContext(ShopContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="wishlist-page" style={{ minHeight: '60vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">Your Wishlist</h1>
          <p className="section-subtitle">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <ProductGrid title="" subtitle="" products={wishlistItems} />
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--brand-dark)' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Browse our collections and tap the heart icon to save items here.</p>
            <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '1rem 2rem', backgroundColor: 'var(--brand-dark)', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Start Browsing</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
