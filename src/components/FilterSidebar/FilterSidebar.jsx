import React, { useState, useEffect } from 'react';
import { Filter, X, ArrowUpDown } from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = ({ onFilterChange, showCategoryFilter = false }) => {
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile filter when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, []);

  const handlePriceChange = (range) => {
    let updatedPrices = [...selectedPrices];
    if (updatedPrices.includes(range)) {
      updatedPrices = updatedPrices.filter(p => p !== range);
    } else {
      updatedPrices.push(range);
    }
    setSelectedPrices(updatedPrices);
    onFilterChange({ prices: updatedPrices, rating: selectedRating });
  };

  const handleRatingChange = (rating) => {
    const newRating = selectedRating === rating ? 0 : rating;
    setSelectedRating(newRating);
    onFilterChange({ prices: selectedPrices, rating: newRating });
  };

  return (
    <>
      {/* Mobile Actions Container */}
      <div className="mobile-actions-bar">
        <button 
          className="mobile-action-btn"
          onClick={() => setIsMobileOpen(true)}
        >
          <Filter size={16} strokeWidth={2} />
          <span>Filters</span>
        </button>
        <button 
          className="mobile-action-btn"
          onClick={() => alert('Sorting feature coming soon!')}
        >
          <ArrowUpDown size={16} strokeWidth={2} />
          <span>Sort</span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="filter-overlay" onClick={() => setIsMobileOpen(false)}></div>
      )}

      <aside className={`filter-sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="filter-sidebar-header">
          <h3>Filters</h3>
          <button onClick={() => setIsMobileOpen(false)} className="close-filter">
            <X size={20} />
          </button>
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Price Range</h3>
          <div className="filter-options">
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedPrices.includes('under-500')} 
                onChange={() => handlePriceChange('under-500')} 
              />
              <span>Under ₹500</span>
            </label>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedPrices.includes('500-1000')} 
                onChange={() => handlePriceChange('500-1000')} 
              />
              <span>₹500 - ₹1000</span>
            </label>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedPrices.includes('over-1000')} 
                onChange={() => handlePriceChange('over-1000')} 
              />
              <span>Over ₹1000</span>
            </label>
          </div>
        </div>

        <div className="filter-section">
          <h3 className="filter-title">Customer Reviews</h3>
          <div className="filter-options">
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedRating === 4} 
                onChange={() => handleRatingChange(4)} 
              />
              <span>4★ & Above</span>
            </label>
            <label className="filter-label">
              <input 
                type="checkbox" 
                checked={selectedRating === 3} 
                onChange={() => handleRatingChange(3)} 
              />
              <span>3★ & Above</span>
            </label>
          </div>
        </div>

        <div className="mobile-filter-footer">
          <button onClick={() => setIsMobileOpen(false)} className="apply-filter-btn">
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
