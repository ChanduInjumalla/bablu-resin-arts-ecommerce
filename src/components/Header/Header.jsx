import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  const announcements = [
    "Free shipping on all premium orders over ₹1500",
    "Shop over ₹2000 and use code EXTRA20 for 20% off",
    "Handcrafted with love for your special occasions"
  ];

  const { cartItems, wishlistItems, setIsCartOpen } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';



  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = ["Necklaces", "Earrings", "Bracelets", "Keychains", "Gifts"];

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${!isHomePage ? 'inner-page-header' : ''}`}>
      {isHomePage && (
        <div className="header-top">
          <div className="announcement-slider">
            {announcements.map((text, index) => (
              <p 
                key={index} 
                className={`announcement-text ${index === currentAnnouncement ? 'active' : ''}`}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      )}
      
      <div className="header-main container">
        <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <div className="header-logo">
          <Link to="/" className="brand-logo-horizontal">
            <span className="logo-bablu">Bablu</span>
            <span className="logo-resin">RESIN ARTS</span>
          </Link>
        </div>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
            <li><Link to="/shop" onClick={() => setMobileMenuOpen(false)}>All Products</Link></li>
            {categories.map((cat) => (
              <li key={cat}><Link to={`/category/${cat.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)}>{cat}</Link></li>
            ))}
            <li><Link to="/#collections" className="nav-highlight" onClick={() => setMobileMenuOpen(false)}>Collections</Link></li>
            <li><Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Order History</Link></li>
          </ul>
        </nav>

        <div className="header-actions">
          <div className={`search-container ${searchOpen ? 'open' : ''}`}>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                setSearchOpen(false);
                setSearchQuery('');
              }
            }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <button className="action-btn" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}>
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <Link to={user ? "/profile" : "/login"} className="action-btn" aria-label="User Account">
            <User size={20} />
          </Link>
          <Link to="/wishlist" className="action-btn wishlist-btn" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
          </Link>
          <button onClick={() => setIsCartOpen(true)} className="action-btn cart-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
