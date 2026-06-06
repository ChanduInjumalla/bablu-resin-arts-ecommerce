import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import FilterSidebar from '../components/FilterSidebar/FilterSidebar';
import { ShopContext } from '../context/ShopContext';

const applyFilters = (products, filters) => {
  if (!filters) return products;
  let filtered = [...products];
  
  if (filters.rating > 0) {
    filtered = filtered.filter(p => p.rating >= filters.rating);
  }
  
  if (filters.prices && filters.prices.length > 0) {
    filtered = filtered.filter(p => {
      if (filters.prices.includes('under-500') && p.price < 500) return true;
      if (filters.prices.includes('500-1000') && p.price >= 500 && p.price <= 1000) return true;
      if (filters.prices.includes('over-1000') && p.price > 1000) return true;
      return false;
    });
  }
  
  return filtered;
};

const PricePage = () => {
  const { amount } = useParams();
  const { products } = useContext(ShopContext);
  const [baseProducts, setBaseProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const maxPrice = parseInt(amount, 10);
    setTitle(`Products under ${maxPrice} Rs`);

    const filtered = products.filter(p => p.price <= maxPrice);
    
    setBaseProducts(filtered);
    setDisplayedProducts(filtered);
  }, [amount, products]);

  const handleFilterChange = (filters) => {
    setDisplayedProducts(applyFilters(baseProducts, filters));
  };

  return (
    <div className="price-page" style={{ minHeight: '60vh' }}>
      <div className="container layout-sidebar-container">
        <FilterSidebar onFilterChange={handleFilterChange} />
        <div className="layout-sidebar-main">
          {displayedProducts.length > 0 ? (
            <ProductGrid title={title} subtitle="Shop by Amount" products={displayedProducts} />
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <h2 className="section-title">No products found</h2>
              <p className="section-subtitle">We couldn't find any products matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePage;
