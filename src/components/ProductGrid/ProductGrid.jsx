import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ title, subtitle, products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="section product-grid-section">
      <div className="container">
        <div className="section-header">
          {subtitle && <span className="section-eyebrow">{subtitle}</span>}
          <h2 className="section-title">{title}</h2>
        </div>
        
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
