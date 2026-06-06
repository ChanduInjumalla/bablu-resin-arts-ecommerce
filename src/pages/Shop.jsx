import React, { useState, useEffect, useContext } from 'react';
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

const Shop = () => {
  const { products } = useContext(ShopContext);
  const [displayedProducts, setDisplayedProducts] = useState(products);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setDisplayedProducts(products);
  }, [products]);

  const handleFilterChange = (filters) => {
    setDisplayedProducts(applyFilters(products, filters));
  };

  return (
    <div className="shop-page" style={{ minHeight: '60vh' }}>
      <div className="container layout-sidebar-container">
        <FilterSidebar onFilterChange={handleFilterChange} />
        <div className="layout-sidebar-main">
          <ProductGrid title="All Products" subtitle="Shop The Collection" products={displayedProducts} />
        </div>
      </div>
    </div>
  );
};

export default Shop;
