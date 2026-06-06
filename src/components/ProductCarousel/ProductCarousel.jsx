import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductCarousel.css';

const ProductCarousel = ({ title, subtitle, products }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="section product-carousel-section">
      <div className="container">
        <div className="carousel-header">
          <div className="section-header">
            <span className="section-eyebrow">{subtitle || title}</span>
            <h2 className="section-title" style={{ margin: 0 }}>{title}</h2>
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn" onClick={() => scroll('left')} aria-label="Scroll left">
              <ChevronLeft size={20} />
            </button>
            <button className="carousel-btn" onClick={() => scroll('right')} aria-label="Scroll right">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="carousel-container" ref={scrollRef}>
          {products.map(product => (
            <div className="carousel-item" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;
