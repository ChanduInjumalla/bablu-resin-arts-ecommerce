import React, { createContext, useState, useEffect } from 'react';
import defaultProducts from '../data/products.json';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, writeBatch } from 'firebase/firestore';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [pincodeMessage, setPincodeMessage] = useState('');

  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!db) {
          console.warn('Firebase not initialized. Falling back to default products.');
          setProducts(defaultProducts);
          setIsProductsLoading(false);
          return;
        }

        const querySnapshot = await getDocs(collection(db, 'products'));
        if (querySnapshot.empty) {
          // Seed the entire database if it's completely empty
          console.log('Database empty. Seeding default products...');
          const batch = writeBatch(db);
          const productsToSeed = defaultProducts;
          
          const newProducts = [];
          productsToSeed.forEach((prod) => {
            const docRef = doc(collection(db, 'products'));
            // Save string ID to match Firebase doc id format
            const prodData = { ...prod, id: docRef.id };
            batch.set(docRef, prodData);
            newProducts.push(prodData);
          });
          
          await batch.commit();
          setProducts(newProducts);
        } else {
          const fetchedProducts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(defaultProducts); // Fallback
      } finally {
        setIsProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      if (!db) return;
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      setProducts(prev => [{ ...newProduct, id: docRef.id }, ...prev]);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product to database");
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      if (!db) return;
      const productRef = doc(db, 'products', String(updatedProduct.id));
      // Remove id from the update payload to avoid overwriting doc ID field if not needed
      const updateData = { ...updatedProduct };
      await updateDoc(productRef, updateData);
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product in database");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      if (!db) return;
      await deleteDoc(doc(db, 'products', String(productId)));
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product from database");
    }
  };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlistItems');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const toggleWishlist = (product) => {
    setWishlistItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const checkPincode = (pincode) => {
    setDeliveryPincode(pincode);
    const subtotal = calculateSubtotal();

    if (pincode.length !== 6) {
      setDeliveryCharge(null);
      setPincodeMessage('Please enter a valid 6-digit pincode.');
      return;
    }

    if (subtotal > 1500) {
      setDeliveryCharge(0);
      setPincodeMessage('Eligible for FREE Delivery!');
      return;
    }

    const gudurPincodes = ['524101', '524102', '524103'];
    
    if (gudurPincodes.includes(pincode)) {
      setDeliveryCharge(30);
      setPincodeMessage('Local Delivery (Gudur): Rs. 30.00');
    } else {
      setDeliveryCharge(80);
      setPincodeMessage('Standard Delivery: Rs. 80.00');
    }
  };

  // Auto-update delivery charge when cart changes
  useEffect(() => {
    if (deliveryPincode && deliveryPincode.length === 6) {
      checkPincode(deliveryPincode);
    }
  }, [cartItems]);

  return (
    <ShopContext.Provider value={{
      cartItems,
      wishlistItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isInWishlist,
      deliveryPincode,
      deliveryCharge,
      pincodeMessage,
      checkPincode,
      calculateSubtotal,
      products,
      isProductsLoading,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ShopContext.Provider>
  );
};
