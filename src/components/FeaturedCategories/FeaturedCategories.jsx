import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import './FeaturedCategories.css';

const categoriesData = [
  { name: "Necklaces", tagline: "Timeless elegance", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=600&h=800&auto=format&fit=crop", items: "42 pieces" },
  { name: "Earrings", tagline: "Statement pieces", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=600&h=800&auto=format&fit=crop", items: "38 pieces" },
  { name: "Bracelets", tagline: "Wrist stories", image: "https://images.unsplash.com/photo-1633810543462-77c4a3b13f07?q=80&w=600&h=800&auto=format&fit=crop", items: "24 pieces" },
  { name: "Keychains", tagline: "Daily charm", image: "https://images.unsplash.com/photo-1575908539614-ff89490f4a78?q=80&w=600&h=800&auto=format&fit=crop", items: "18 pieces" },
  { name: "Hair Accessories", tagline: "Crown yourself", image: "https://images.unsplash.com/photo-1549236177-77e8271c34b6?q=80&w=600&h=800&auto=format&fit=crop", items: "22 pieces" },
  { name: "Customized Gifts", tagline: "Personal touch", image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?q=80&w=600&h=800&auto=format&fit=crop", items: "30 pieces" },
  { name: "Beauty Products", tagline: "Glow natural", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&h=800&auto=format&fit=crop", items: "26 pieces" },
  { name: "Resin Products", tagline: "Art meets craft", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&h=800&auto=format&fit=crop", items: "20 pieces" },
];

const FeaturedCategories = () => {
  return (
    <section className="section categories-section" id="collections">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Curated Collections</span>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Explore our handpicked categories of premium accessories and lifestyle products</p>
        </div>
        
        <div className="category-grid">
          {categoriesData.map((cat, index) => {
            const categoryUrl = cat.name.toLowerCase().includes('custom') ? 'gifts' : cat.name.toLowerCase();
            return (
              <Link to={`/category/${categoryUrl}`} key={index} className="category-card">
                <div className="category-image-wrapper">
                  <img src={cat.image} alt={cat.name} className="category-image" />
                </div>
                <div className="category-info">
                  <div className="category-text">
                    <h3 className="category-name">{cat.name}</h3>
                    <p className="category-tagline">{cat.tagline}</p>
                  </div>
                  <div className="category-meta">
                    <span className="category-count">{cat.items}</span>
                    <span className="category-arrow"><ArrowUpRight size={16} /></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
