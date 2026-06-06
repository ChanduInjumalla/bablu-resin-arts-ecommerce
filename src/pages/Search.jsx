import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import { ShopContext } from '../context/ShopContext';

const Search = () => {
  const { products } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (!query.trim()) {
      setResults([]);
      setSimilarProducts(products.filter(p => p.isTrending).slice(0, 8));
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matched = products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) || 
      product.category.toLowerCase().includes(lowerQuery)
    );

    setResults(matched);

    if (matched.length === 0) {
      // Find some similar/popular products if none match
      setSimilarProducts(products.filter(p => p.isBestSeller).slice(0, 8));
    }
  }, [query, products]);

  return (
    <div className="search-page" style={{ minHeight: '60vh' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="section-title">Search Results</h1>
          <p className="section-subtitle">
            {query ? `Showing results for "${query}"` : 'Enter a search term to find products'}
          </p>
        </div>

        {results.length > 0 ? (
          <ProductGrid title="" subtitle="" products={results} />
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', margin: '2rem 0 4rem' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem', color: 'var(--brand-dark)' }}>No product found</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We couldn't find anything matching your search. Try adjusting your keywords.</p>
            <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', padding: '1rem 2rem', backgroundColor: 'var(--brand-dark)', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Browse All Products</Link>
          </div>
        )}

        {/* Similar Products Fallback */}
        {results.length === 0 && similarProducts.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--border-color)' }}>
            <ProductGrid title="You might also like" subtitle="Trending items" products={similarProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
