import React from 'react';
import { ArrowRight } from 'lucide-react';
import './PromoBanner.css';

const PromoBanner = () => {
  return (
    <section className="promo-banner-section">
      <div className="promo-inner container">
        <div className="promo-left">
          <div className="promo-image-wrapper">
            <img 
              src="https://placehold.co/800x900/d4b8a0/8a7060?text=." 
              alt="Featured Collection" 
              className="promo-image"
            />
          </div>
        </div>
        
        <div className="promo-right">
          <span className="promo-eyebrow">Limited Edition</span>
          <h2 className="promo-title">The Bridal<br/>Collection</h2>
          <div className="promo-divider"></div>
          <p className="promo-description">
            Handcrafted pieces designed for your most special moments. Each creation is a testament to the elegance of pure artisanship — timeless, luxurious, unforgettable.
          </p>
          <div className="promo-stats">
            <div className="promo-stat">
              <span className="stat-number">120+</span>
              <span className="stat-label">Unique Designs</span>
            </div>
            <div className="promo-stat">
              <span className="stat-number">24K</span>
              <span className="stat-label">Gold Plated</span>
            </div>
            <div className="promo-stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Handcrafted</span>
            </div>
          </div>
          <button className="promo-cta">
            <span>Explore Collection</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
