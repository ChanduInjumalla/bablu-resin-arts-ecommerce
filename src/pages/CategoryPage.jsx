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

const CategoryPage = () => {
  const { categoryId } = useParams();
  const { products } = useContext(ShopContext);
  const [baseProducts, setBaseProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const title = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    setCategoryTitle(title);

    let filtered;
    if (categoryId.toLowerCase() === 'gifts') {
      filtered = products.filter(p => p.category.toLowerCase().includes('gift'));
    } else {
      filtered = products.filter(p => p.category.toLowerCase() === categoryId.toLowerCase());
    }
    
    setBaseProducts(filtered);
    setDisplayedProducts(filtered);
  }, [categoryId, products]);

  const handleFilterChange = (filters) => {
    setDisplayedProducts(applyFilters(baseProducts, filters));
  };

  return (
    <div className="category-page" style={{ minHeight: '60vh' }}>
      <div className="container layout-sidebar-container">
        <FilterSidebar onFilterChange={handleFilterChange} />
        <div className="layout-sidebar-main">
          {displayedProducts.length > 0 ? (
            <ProductGrid title={categoryTitle} subtitle="Category" products={displayedProducts} />
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

export default CategoryPage;
