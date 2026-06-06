import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ChevronDown, ChevronUp, Search, Shield, Lock, Truck, MapPin, ChevronRight, ChevronLeft, Tag, X, Check, AlertCircle, ShoppingBag, Minus, Plus, Trash2, Navigation, Loader2 } from 'lucide-react';
import './Checkout.css';

const VALID_COUPONS = {
  'SAVE10': { type: 'percent', value: 10, label: '10% off' },
  'WELCOME20': { type: 'percent', value: 20, label: '20% off' },
  'FIRSTORDER': { type: 'flat', value: 150, label: '₹150 off' },
};

const Checkout = () => {
  const { 
    cartItems, 
    updateQuantity,
    removeFromCart,
    clearCart,
    deliveryPincode,
    deliveryCharge,
    pincodeMessage,
    checkPincode
  } = useContext(ShopContext);

  const { user } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('ship');
  const [billingAddress, setBillingAddress] = useState('same');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileOrderOpen, setMobileOrderOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });

  // Form state
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    phone: user?.phone || '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Auto-fill when user logs in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.name?.split(' ')[0] || prev.firstName,
        lastName: user.name?.split(' ').slice(1).join(' ') || prev.lastName,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validation
  const validateStep1 = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter a valid 6-digit PIN';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid 10-digit phone';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculations
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const subtotal = calculateSubtotal();
    if (appliedCoupon.type === 'percent') {
      return Math.round(subtotal * (appliedCoupon.value / 100));
    }
    return Math.min(appliedCoupon.value, subtotal);
  };

  const calculateTax = () => {
    const afterDiscount = calculateSubtotal() - calculateDiscount();
    return 0; // No tax for now, but the row is visible
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax() + (deliveryCharge || 0);
  };

  // Coupon handlers
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage({ text: 'Please enter a coupon code', type: 'error' });
      return;
    }
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ ...VALID_COUPONS[code], code });
      setCouponMessage({ text: `Coupon "${code}" applied! ${VALID_COUPONS[code].label}`, type: 'success' });
      setCouponCode('');
    } else {
      setCouponMessage({ text: 'Invalid coupon code. Please try again.', type: 'error' });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage({ text: 'Coupon removed.', type: '' });
    setTimeout(() => setCouponMessage({ text: '', type: '' }), 2000);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
        const data = await response.json();
        
        if (data && data.address) {
          const addr = data.address;
          setFormData(prev => ({
            ...prev,
            address: addr.road || addr.suburb || addr.neighbourhood || data.display_name.split(',')[0],
            city: addr.city || addr.town || addr.village || prev.city,
            state: addr.state || prev.state,
            pincode: addr.postcode || prev.pincode
          }));
          if (addr.postcode) checkPincode(addr.postcode);
        }
      } catch (error) {
        console.error("Error fetching location details:", error);
        alert("Failed to get address from coordinates.");
      } finally {
        setIsLocating(false);
      }
    }, (error) => {
      setIsLocating(false);
      if (error.code === 1) alert("Please allow location access to use this feature.");
      else alert("Failed to get location.");
    });
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // 1. Load Razorpay Script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const totalAmount = calculateTotal();

      // 2. Create Order on our Backend
      let orderDataBackend = { success: false };
      try {
        const orderResponse = await fetch('http://localhost:5001/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalAmount, currency: 'INR' })
        });
        orderDataBackend = await orderResponse.json();
      } catch (err) {
        console.warn("Backend not running or unreachable. Falling back to Test Mode.");
      }

      // TEST MODE FALLBACK: If backend fails or returns error (because of invalid keys)
      if (!orderDataBackend.success) {
        console.log("Using Razorpay Test Mode Fallback");
        const confirmTest = window.confirm(
          "Backend is not connected or API keys are invalid. Would you like to simulate a successful payment in TEST MODE?"
        );
        
        if (confirmTest) {
          // Simulate successful backend save
          if (db) {
            const subtotal = calculateSubtotal();
            const discount = calculateDiscount();
            const tax = calculateTax();
            const dbOrderData = {
              customerInfo: { email: formData.email, firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone },
              shippingAddress: { address: formData.address, apartment: formData.apartment, city: formData.city, state: formData.state, pincode: formData.pincode, country: formData.country },
              items: cartItems.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image })),
              pricing: { subtotal, discount, tax, deliveryCharge: deliveryCharge || 0, total: totalAmount },
              appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
              paymentMethod: 'Test Mode (Simulated)',
              status: 'Paid',
              createdAt: serverTimestamp(),
              userId: user ? user.uid || user.email : 'guest'
            };
            const docRef = await addDoc(collection(db, 'orders'), dbOrderData);
            clearCart();
            navigate(`/order-confirmation/${docRef.id}`);
          }
        }
        setIsProcessing(false);
        return;
      }

      // 3. Initialize Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID', // Replace in .env
        amount: orderDataBackend.order.amount,
        currency: 'INR',
        name: 'Bablu Resin Arts',
        description: 'Premium Resin & Jewelry',
        image: '/bablu_resin_arts_logo.png', // Add a valid logo path if available
        order_id: orderDataBackend.order.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment on Backend
            const verifyResponse = await fetch('http://localhost:5001/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // 5. Save to Firestore
              if (!db) {
                console.warn("Firebase not configured, skipping db save.");
              } else {
                const subtotal = calculateSubtotal();
                const discount = calculateDiscount();
                const tax = calculateTax();

                const dbOrderData = {
                  customerInfo: {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone
                  },
                  shippingAddress: {
                    address: formData.address,
                    apartment: formData.apartment,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country,
                  },
                  items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                  })),
                  pricing: {
                    subtotal,
                    discount,
                    tax,
                    deliveryCharge: deliveryCharge || 0,
                    total: totalAmount
                  },
                  appliedCoupon: appliedCoupon ? appliedCoupon.code : null,
                  paymentMethod: 'Razorpay',
                  paymentDetails: {
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id
                  },
                  status: 'Paid',
                  createdAt: serverTimestamp(),
                  userId: user ? user.uid || user.email : 'guest'
                };

                await addDoc(collection(db, 'orders'), dbOrderData);
              }

              alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
              clearCart();
              navigate('/');
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error(err);
            alert("Error verifying payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#c4985a'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });
      
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong opening Razorpay.");
      setIsProcessing(false);
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        
        {/* ===== LEFT SIDE: MAIN FORM ===== */}
        <div className="checkout-main">
          <header className="checkout-header">
            <Link to="/" className="checkout-brand">
              <span className="logo-bablu">Bablu</span>
              <span className="logo-resin">RESIN ARTS</span>
            </Link>
          </header>

          {/* Checkout Steps */}
          <div className="checkout-steps">
            {['Information', 'Shipping', 'Payment'].map((label, i) => (
              <React.Fragment key={label}>
                {i > 0 && <span className="step-divider" />}
                <div 
                  className={`step ${currentStep >= i + 1 ? 'active' : ''} ${currentStep === i + 1 ? 'current' : ''}`}
                  onClick={() => { if (i + 1 < currentStep) setCurrentStep(i + 1); }}
                  style={{ cursor: i + 1 < currentStep ? 'pointer' : 'default' }}
                >
                  <span className="step-number">
                    {currentStep > i + 1 ? <Check size={12} /> : i + 1}
                  </span>
                  <span>{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Order Summary Toggle */}
          <div className="mobile-order-toggle" onClick={() => setMobileOrderOpen(!mobileOrderOpen)}>
            <div className="mobile-toggle-left">
              <ShoppingBag size={18} />
              <span>{mobileOrderOpen ? 'Hide' : 'Show'} order summary</span>
              {mobileOrderOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <span className="mobile-toggle-total">₹{calculateTotal().toFixed(2)}</span>
          </div>
          {mobileOrderOpen && (
            <div className="mobile-order-content">
              {renderOrderSummaryContent()}
            </div>
          )}

          <form onSubmit={currentStep === 3 ? handlePayNow : nextStep} className="checkout-form" noValidate>
            
            {/* STEP 1: INFORMATION */}
            {currentStep === 1 && (
              <div className="step-content">
                <section className="checkout-section">
                  <div className="section-header-flex">
                    <h2>Contact Information</h2>
                    {!user && <Link to="/login" className="login-link">Already have an account? Sign in</Link>}
                  </div>

                  {user && (
                    <div className="logged-in-banner">
                      <Check size={16} />
                      <span>Logged in as <strong>{user.name || user.email}</strong></span>
                    </div>
                  )}

                  <div className={`form-control ${errors.email ? 'has-error' : ''}`}>
                    <label htmlFor="checkout-email">Email Address</label>
                    <input 
                      id="checkout-email"
                      type="email" 
                      placeholder="you@example.com" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required 
                    />
                    {errors.email && <span className="field-error"><AlertCircle size={13} /> {errors.email}</span>}
                  </div>

                  <div className="checkbox-control">
                    <input type="checkbox" id="emailOffers" defaultChecked />
                    <label htmlFor="emailOffers">Email me with news and offers</label>
                  </div>
                </section>
                
                <div className="step-actions">
                  <Link to="/cart" className="back-link"><ChevronLeft size={16} /> Return to cart</Link>
                  <button type="submit" className="continue-btn">Continue to shipping <ChevronRight size={18} /></button>
                </div>
              </div>
            )}

            {/* STEP 2: SHIPPING */}
            {currentStep === 2 && (
              <div className="step-content">
                {/* Summary of Step 1 */}
                <div className="step-summary-card">
                  <div className="summary-detail">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{formData.email}</span>
                    <button type="button" className="change-btn" onClick={() => setCurrentStep(1)}>Change</button>
                  </div>
                </div>

                <section className="checkout-section">
                  <h2>Delivery</h2>
                  <div className="delivery-method-toggle">
                    <div 
                      className={`method-option ${deliveryMethod === 'ship' ? 'active' : ''}`}
                      onClick={() => setDeliveryMethod('ship')}
                    >
                      <Truck size={20} />
                      <span>Ship</span>
                    </div>
                    <div 
                      className={`method-option ${deliveryMethod === 'pickup' ? 'active' : ''}`}
                      onClick={() => setDeliveryMethod('pickup')}
                    >
                      <MapPin size={20} />
                      <span>Pickup</span>
                    </div>
                  </div>

                  {deliveryMethod === 'ship' && (
                    <div className="address-form">
                      <div className="form-control select-control">
                        <label>Country/Region</label>
                        <select value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)}>
                          <option value="India">India</option>
                          <option value="US">United States</option>
                          <option value="UK">United Kingdom</option>
                        </select>
                        <ChevronDown size={16} className="select-icon" />
                      </div>
                      
                      <div className="form-row">
                        <div className={`form-control ${errors.firstName ? 'has-error' : ''}`}>
                          <label>First Name</label>
                          <input type="text" placeholder="First name" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} required />
                          {errors.firstName && <span className="field-error"><AlertCircle size={13} /> {errors.firstName}</span>}
                        </div>
                        <div className={`form-control ${errors.lastName ? 'has-error' : ''}`}>
                          <label>Last Name</label>
                          <input type="text" placeholder="Last name" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} required />
                          {errors.lastName && <span className="field-error"><AlertCircle size={13} /> {errors.lastName}</span>}
                        </div>
                      </div>

                      <div className="location-action-row">
                        <button type="button" className="locate-btn" onClick={handleLocateMe} disabled={isLocating}>
                          {isLocating ? <Loader2 size={16} className="spin" /> : <Navigation size={16} />}
                          <span>{isLocating ? 'Locating...' : 'Use my current location'}</span>
                        </button>
                      </div>

                      <div className={`form-control search-input ${errors.address ? 'has-error' : ''}`}>
                        <label>Address</label>
                        <input type="text" placeholder="Street address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} required />
                        <Search size={16} className="input-icon" />
                        {errors.address && <span className="field-error"><AlertCircle size={13} /> {errors.address}</span>}
                      </div>

                      <div className="form-control">
                        <label>Apartment (optional)</label>
                        <input type="text" placeholder="Apartment, suite, etc." value={formData.apartment} onChange={(e) => handleInputChange('apartment', e.target.value)} />
                      </div>

                      <div className="form-row three-col">
                        <div className={`form-control ${errors.city ? 'has-error' : ''}`}>
                          <label>City</label>
                          <input type="text" placeholder="City" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} required />
                          {errors.city && <span className="field-error"><AlertCircle size={13} /> {errors.city}</span>}
                        </div>
                        <div className={`form-control select-control ${errors.state ? 'has-error' : ''}`}>
                          <label>State</label>
                          <select value={formData.state} onChange={(e) => handleInputChange('state', e.target.value)}>
                            <option value="" disabled>Select state</option>
                            <option value="AP">Andhra Pradesh</option>
                            <option value="TS">Telangana</option>
                            <option value="KA">Karnataka</option>
                            <option value="TN">Tamil Nadu</option>
                            <option value="MH">Maharashtra</option>
                            <option value="DL">Delhi</option>
                            <option value="GJ">Gujarat</option>
                            <option value="RJ">Rajasthan</option>
                            <option value="KL">Kerala</option>
                            <option value="WB">West Bengal</option>
                            <option value="UP">Uttar Pradesh</option>
                            <option value="MP">Madhya Pradesh</option>
                            <option value="BR">Bihar</option>
                            <option value="OR">Odisha</option>
                            <option value="PB">Punjab</option>
                            <option value="HR">Haryana</option>
                          </select>
                          <ChevronDown size={16} className="select-icon" />
                          {errors.state && <span className="field-error"><AlertCircle size={13} /> {errors.state}</span>}
                        </div>
                        <div className={`form-control ${errors.pincode ? 'has-error' : ''}`}>
                          <label>PIN Code</label>
                          <input 
                            type="text" 
                            placeholder="6-digit PIN" 
                            value={formData.pincode}
                            maxLength="6"
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '');
                              handleInputChange('pincode', val);
                              if (val.length === 6) checkPincode(val);
                            }}
                            required
                          />
                          {errors.pincode && <span className="field-error"><AlertCircle size={13} /> {errors.pincode}</span>}
                          {pincodeMessage && formData.pincode.length === 6 && !errors.pincode && (
                            <span className="field-success"><Check size={13} /> {pincodeMessage}</span>
                          )}
                        </div>
                      </div>

                      <div className={`form-control ${errors.phone ? 'has-error' : ''}`}>
                        <label>Phone Number</label>
                        <input 
                          type="tel" 
                          placeholder="10-digit mobile number" 
                          value={formData.phone} 
                          onChange={(e) => handleInputChange('phone', e.target.value.replace(/[^0-9]/g, ''))} 
                          maxLength="10"
                          required 
                        />
                        {errors.phone && <span className="field-error"><AlertCircle size={13} /> {errors.phone}</span>}
                      </div>

                      <div className="checkbox-control">
                        <input type="checkbox" id="saveInfo" />
                        <label htmlFor="saveInfo">Save this information for next time</label>
                      </div>
                    </div>
                  )}
                </section>

                <div className="step-actions">
                  <button type="button" className="back-link" onClick={prevStep}><ChevronLeft size={16} /> Return to information</button>
                  <button type="submit" className="continue-btn">Continue to payment <ChevronRight size={18} /></button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT */}
            {currentStep === 3 && (
              <div className="step-content">
                {/* Summary of previous steps */}
                <div className="step-summary-card">
                  <div className="summary-detail">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{formData.email}</span>
                    <button type="button" className="change-btn" onClick={() => setCurrentStep(1)}>Change</button>
                  </div>
                  <div className="summary-detail">
                    <span className="detail-label">Ship to</span>
                    <span className="detail-value">{formData.address}, {formData.city} - {formData.pincode}</span>
                    <button type="button" className="change-btn" onClick={() => setCurrentStep(2)}>Change</button>
                  </div>
                  {deliveryCharge !== null && (
                    <div className="summary-detail">
                      <span className="detail-label">Shipping</span>
                      <span className="detail-value">{deliveryCharge === 0 ? 'Free Shipping' : `Standard — ₹${deliveryCharge.toFixed(2)}`}</span>
                    </div>
                  )}
                </div>

                <section className="checkout-section">
                  <h2>Payment</h2>
                  <p className="section-desc">All transactions are secure and encrypted.</p>
                  
                  <div className="payment-box">
                    <div className="payment-header">
                      <div className="payment-header-left">
                        <input type="radio" name="payment-method" defaultChecked />
                        <span className="payment-title">Razorpay Secure (UPI, Cards, Wallets)</span>
                      </div>
                      <div className="payment-icons">
                        <span className="mini-icon">UPI</span>
                        <span className="mini-icon">VISA</span>
                        <span className="mini-icon">MC</span>
                      </div>
                    </div>
                    <div className="payment-body">
                      <div className="secure-icon">
                        <Lock size={32} strokeWidth={1.2} />
                      </div>
                      <p>You'll be redirected to Razorpay to complete your purchase securely.</p>
                    </div>
                  </div>
                </section>

                <section className="checkout-section">
                  <h2>Billing Address</h2>
                  <div className="radio-group">
                    <label className="radio-control border-bottom">
                      <input type="radio" name="billing" checked={billingAddress === 'same'} onChange={() => setBillingAddress('same')} />
                      <span>Same as shipping address</span>
                    </label>
                    <label className="radio-control">
                      <input type="radio" name="billing" checked={billingAddress === 'different'} onChange={() => setBillingAddress('different')} />
                      <span>Use a different billing address</span>
                    </label>
                  </div>
                </section>

                <div className="step-actions">
                  <button type="button" className="back-link" onClick={prevStep}><ChevronLeft size={16} /> Return to shipping</button>
                  <button type="submit" className="pay-now-btn" disabled={isProcessing}>
                    <span>{isProcessing ? 'Processing...' : `Pay ₹${calculateTotal().toFixed(2)}`}</span>
                  </button>
                </div>
              </div>
            )}
          </form>

          <footer className="checkout-footer">
            <Link to="/refund-policy">Refund policy</Link>
            <Link to="/shipping">Shipping</Link>
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms-of-service">Terms of service</Link>
            <Link to="/contact">Contact</Link>
          </footer>
        </div>

        {/* ===== RIGHT SIDE: ORDER SUMMARY ===== */}
        <div className="checkout-sidebar">
          <div className="sidebar-content">
            {renderOrderSummaryContent()}
          </div>
        </div>
      </div>
    </div>
  );

  function renderOrderSummaryContent() {
    return (
      <>
        <h3 className="sidebar-title">
          Order Summary
          <span className="item-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </h3>
        
        {/* Scrollable product list */}
        <div className="order-items-container">
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <div className="item-image-box">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <span className="item-name">{item.name}</span>
                  {item.category && <span className="item-category">{item.category}</span>}
                  <div className="item-qty-controls">
                    <button type="button" className="qty-btn" onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeFromCart(item.id)} aria-label="Decrease quantity">
                      {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button type="button" className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase quantity">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="item-pricing">
                    <span className="item-unit-price">₹{item.price.toFixed(2)} each</span>
                  </div>
                </div>
                <div className="item-total-price">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Code — Fixed */}
        <div className="discount-section">
          {appliedCoupon ? (
            <div className="applied-coupon">
              <div className="coupon-tag">
                <Tag size={14} />
                <span>{appliedCoupon.code}</span>
                <span className="coupon-label">{appliedCoupon.label}</span>
              </div>
              <button type="button" className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="coupon-input-row">
              <input 
                type="text" 
                placeholder="Discount code" 
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  if (couponMessage.text) setCouponMessage({ text: '', type: '' });
                }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
              />
              <button type="button" onClick={handleApplyCoupon}>Apply</button>
            </div>
          )}
          {couponMessage.text && (
            <div className={`coupon-message ${couponMessage.type}`}>
              {couponMessage.type === 'success' ? <Check size={14} /> : couponMessage.type === 'error' ? <AlertCircle size={14} /> : null}
              {couponMessage.text}
            </div>
          )}
        </div>

        {/* Summary — Fixed */}
        <div className="summary-section">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span className={deliveryCharge === 0 ? 'free-tag' : ''}>
              {deliveryCharge !== null 
                ? (deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`) 
                : <span className="shipping-calc">Enter address</span>}
            </span>
          </div>
          {appliedCoupon && (
            <div className="summary-row discount-row">
              <span>Discount ({appliedCoupon.code})</span>
              <span>−₹{calculateDiscount().toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Tax</span>
            <span>₹{calculateTax().toFixed(2)}</span>
          </div>
        </div>

        {/* Grand Total — Fixed */}
        <div className="total-section">
          <span className="total-label">Grand Total</span>
          <span className="total-price">
            <span className="currency">INR</span>
            <strong>₹{calculateTotal().toFixed(2)}</strong>
          </span>
        </div>

        <div className="secure-badge">
          <Shield size={14} />
          <span>Secured by SSL Encryption</span>
        </div>
      </>
    );
  }
};

export default Checkout;
