import React, { useState, useContext } from 'react';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useContext(ShopContext);
  const navigate = useNavigate();
  const isLiked = isInWishlist(product.id);

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-image-container">
        <Link to={`/product/${product.id}`} style={{ display: 'block', height: '100%' }}>
          <img src={product.image} alt={product.name} className="product-image" />
        </Link>
        
        {/* Badges */}
        <div className="product-badges">
          {product.outOfStock && <span className="badge-out-of-stock" style={{ backgroundColor: 'black', color: 'white', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Out of Stock</span>}
          {!product.outOfStock && product.originalPrice && <span className="badge-sale">Sale</span>}
          {!product.outOfStock && product.isNew && <span className="badge-new">New</span>}
        </div>

        {/* Hover Actions */}
        <div className={`product-actions ${isHovered ? 'visible' : ''}`}>
          <button 
            className="icon-btn wishlist-btn" 
            title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          >
            <Heart size={18} className={isLiked ? "heart-filled" : ""} fill={isLiked ? "currentColor" : "none"} color={isLiked ? "var(--brand-accent)" : "currentColor"} />
          </button>
          <button 
            className="icon-btn quick-view-btn" 
            title="Quick View"
            onClick={(e) => { e.preventDefault(); navigate(`/product/${product.id}`); }}
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'} 
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="review-count">({product.reviews})</span>
        </div>

        <div className="product-price">
          {product.originalPrice ? (
            <>
              <span className="price-offer">Rs. {product.price}</span>
              <span className="price-original">Rs. {product.originalPrice}</span>
            </>
          ) : (
            <span className="price-regular">Rs. {product.price}</span>
          )}
        </div>
        
        <button 
          className="persistent-add-to-cart-btn"
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          disabled={product.outOfStock}
          style={product.outOfStock ? { backgroundColor: '#ccc', cursor: 'not-allowed' } : {}}
        >
          {product.outOfStock ? 'Out of Stock' : 'Add To Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
