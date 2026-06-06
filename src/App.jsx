import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/CartDrawer/CartDrawer';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import DynamicTitle from './components/DynamicTitle';
import AdminRoute from './components/AdminRoute/AdminRoute';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';

// Lazy loading pages for performance
const Home = lazy(() => import('./pages/Home'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const Shop = lazy(() => import('./pages/Shop'));
const PricePage = lazy(() => import('./pages/PricePage'));
const Search = lazy(() => import('./pages/Search'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Legal = lazy(() => import('./pages/Legal'));
const Contact = lazy(() => import('./pages/Contact'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));

const LoadingFallback = () => (
  <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
    Loading page...
  </div>
);

import { useLocation } from 'react-router-dom';

const MainContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`app ${isAdmin ? 'admin-mode' : 'shop-mode'}`}>
      {!isAdmin && <Header />}
      
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/price/:amount" element={<PricePage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/legal/:type" element={<Legal />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </Suspense>
      </main>
      
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <CartDrawer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <DynamicTitle />
          <MainContent />
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
