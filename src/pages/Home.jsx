import React, { useState, useEffect, useContext } from 'react';
import Hero from '../components/Hero/Hero';
import FeaturedCategories from '../components/FeaturedCategories/FeaturedCategories';
import ProductCarousel from '../components/ProductCarousel/ProductCarousel';
import ShopByAmount from '../components/ShopByAmount/ShopByAmount';
import Features from '../components/Features/Features';
import Reviews from '../components/Reviews/Reviews';
import Gallery from '../components/Gallery/Gallery';
import { ShopContext } from '../context/ShopContext';

const Home = () => {
  const { products } = useContext(ShopContext);
  const [trending, setTrending] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    setTrending(products.filter(p => p.isTrending).slice(0, 12));
    setBestSellers(products.filter(p => p.isBestSeller).slice(0, 12));
    setNewArrivals(products.filter(p => p.isNew).slice(0, 12));
  }, [products]);

  return (
    <div className="home-page">
      <Hero />
      <FeaturedCategories />
      
      <div id="new-arrivals">
        <ProductCarousel title="New Arrivals" subtitle="Just Landed" products={newArrivals} />
      </div>
      
      <ShopByAmount />
      
      <div id="trending">
        <ProductCarousel title="Trending Now" subtitle="Most Loved" products={trending} />
      </div>
      
      <Features />
      
      <div id="best-sellers">
        <ProductCarousel title="Best Sellers" subtitle="Customer Favorites" products={bestSellers} />
      </div>
      
      <Reviews />
      <Gallery />
    </div>
  );
};

export default Home;
