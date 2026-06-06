import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'Bablu Resin Arts'; // Default for home page

    if (path === '/shop') {
      title = 'Shop - Bablu Resin Arts';
    } else if (path === '/cart') {
      title = 'Shopping Cart - Bablu Resin Arts';
    } else if (path === '/checkout') {
      title = 'Checkout - Bablu Resin Arts';
    } else if (path === '/wishlist') {
      title = 'Wishlist - Bablu Resin Arts';
    } else if (path === '/search') {
      title = 'Search - Bablu Resin Arts';
    } else if (path.startsWith('/category/')) {
      // Could extract category name here, but simple for now
      title = 'Collections - Bablu Resin Arts';
    }

    document.title = title;
  }, [location]);

  return null;
};

export default DynamicTitle;
