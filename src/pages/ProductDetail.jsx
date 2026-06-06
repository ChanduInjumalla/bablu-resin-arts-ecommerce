import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { Heart, ShoppingBag, ShieldCheck, Truck, Star, ArrowLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, isProductsLoading } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!isProductsLoading) {
      const foundProduct = products.find(p => String(p.id) === String(id));
      if (foundProduct) {
        setProduct(foundProduct);
        // Find related products in same category
        const related = products
          .filter(p => p.category === foundProduct.category && String(p.id) !== String(id))
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        // Handle not found
        setProduct('not_found');
      }
    }
  }, [id, products, isProductsLoading]);

  if (isProductsLoading) {
    return <div className="product-detail-page" style={{ textAlign: 'center', paddingTop: '10rem' }}>Loading product details...</div>;
  }

  if (product === 'not_found' || !product) {
    return (
      <div className="product-detail-page" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/shop')} className="btn-primary" style={{ marginTop: '2rem' }}>Back to Shop</button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);

  return (
    <div className="product-detail-page">
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="product-detail-container">
        <div className="product-detail-image-sec">
          <img src={product.image} alt={product.name} />
          {product.outOfStock && (
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'black', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Out of Stock</div>
          )}
        </div>

        <div className="product-detail-info">
          <div className="product-detail-category">{product.category}</div>
          <h1>{product.name}</h1>
          
          <div className="product-detail-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < Math.floor(product.rating || 4.5) ? 'currentColor' : 'none'}
                  color={i < Math.floor(product.rating || 4.5) ? 'currentColor' : '#ccc'}
                />
              ))}
            </div>
            <span className="reviews">({product.reviews || Math.floor(Math.random() * 100 + 10)} customer reviews)</span>
          </div>

          <div className="product-detail-price">
            <span className="current">Rs. {product.price}</span>
            {product.originalPrice && <span className="original">Rs. {product.originalPrice}</span>}
          </div>

          <div className="product-detail-desc">
            <p>Handcrafted to perfection, this {product.name.toLowerCase()} is designed to elevate your everyday style. Made with premium quality materials to ensure durability and lasting shine.</p>
            <p>Perfect for gifting your loved ones or treating yourself to something special.</p>
          </div>

          <div className="product-detail-actions">
            <button 
              className="product-detail-btn"
              onClick={() => addToCart(product)}
              disabled={product.outOfStock}
            >
              <ShoppingBag size={20} />
              {product.outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button 
              className="product-detail-wishlist"
              onClick={() => toggleWishlist(product)}
              title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              <Heart size={24} fill={isLiked ? "var(--brand-accent)" : "none"} color={isLiked ? "var(--brand-accent)" : "currentColor"} />
            </button>
          </div>

          <div className="product-detail-meta">
            <div className="meta-item">
              <ShieldCheck size={20} />
              <span>100% Quality Guarantee on all products</span>
            </div>
            <div className="meta-item">
              <Truck size={20} />
              <span>Fast shipping across India</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="product-grid">
            {relatedProducts.map(relProduct => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
