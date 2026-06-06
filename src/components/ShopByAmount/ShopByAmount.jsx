import React from 'react';
import { Link } from 'react-router-dom';
import './ShopByAmount.css';

const priceRanges = [
  { amount: 49, label: "Under 49 Rs", image: "https://placehold.co/400x400/e0d5c8/000000?text=Products+under%0A49%E2%82%B9" },
  { amount: 99, label: "Under 99 Rs", image: "https://placehold.co/400x400/e0d5c8/000000?text=Products+under%0A99%E2%82%B9" },
  { amount: 199, label: "Under 199 Rs", image: "https://placehold.co/400x400/e0d5c8/000000?text=Products+under%0A199%E2%82%B9" },
  { amount: 499, label: "Under 499 Rs", image: "https://placehold.co/400x400/e0d5c8/000000?text=Products+under%0A499%E2%82%B9" }
];

const ShopByAmount = () => {
  return (
    <section className="section shop-by-amount-section">
      <div className="container">
        <div className="section-header">
          <Link to="/shop" className="shop-more-btn">Shop more</Link>
          <h2 className="section-title">Shop by amount</h2>
        </div>
        
        <div className="amount-grid">
          {priceRanges.map((range, index) => (
            <Link to={`/price/${range.amount}`} key={index} className="amount-card">
              <div className="amount-image-wrapper">
                <img src={range.image} alt={`Products under ${range.amount}`} className="amount-image" />
              </div>
              <div className="amount-info">
                <h3 className="amount-label">{range.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByAmount;
