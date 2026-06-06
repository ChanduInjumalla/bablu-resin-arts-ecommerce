import React, { createContext, useState, useEffect } from 'react';
import { auth, provider } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('authUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!auth) return; // Skip if Firebase is not configured
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map firebase user to our user structure
        const userData = {
          email: firebaseUser.email,
          role: firebaseUser.email === 'admin@babluresinarts.com' ? 'admin' : 'customer',
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          phone: firebaseUser.phoneNumber || ''
        };
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
      } else {
        // Only clear if we were using firebase auth
        if (user && user.uid) {
          setUser(null);
          localStorage.removeItem('authUser');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Standard Login (Email & Password)
  const loginUser = async (email, password) => {
    // 1. Hardcoded admin fallback for prototype (if Firebase is not configured)
    if (email === 'admin@babluresinarts.com' && password === 'bablu@799565') {
      const userData = { email, role: 'admin' };
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      return { success: true };
    }

    // 2. Firebase Login
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }

    // 3. Mock regular user fallback using localStorage database
    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const existingUser = storedUsers.find(u => u.email === email && u.password === password);
    
    if (existingUser) {
      const userData = { email: existingUser.email, name: existingUser.name, phone: existingUser.phone, role: 'customer' };
      setUser(userData);
      localStorage.setItem('authUser', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, message: "Account not found or incorrect password. Please create an account." };
  };

  // Create User (Email & Password)
  const registerUser = async (email, password, name, phone) => {
    if (auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        // Phone number can't be easily set without phone auth in Firebase, so we omit for now or store in DB later.
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
    // Mock registration fallback
    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    
    // Check if user already exists
    if (storedUsers.some(u => u.email === email)) {
      return { success: false, message: "An account with this email already exists." };
    }

    // Save new user
    storedUsers.push({ email, password, name, phone });
    localStorage.setItem('mockUsers', JSON.stringify(storedUsers));

    const userData = { email, name, phone, role: 'customer' };
    setUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
    return { success: true };
  };

  // Google Sign-In
  const loginWithGoogle = async () => {
    if (auth && provider) {
      try {
        await signInWithPopup(auth, provider);
        return { success: true };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
    
    // Mock fallback
    const userData = { email: 'google.user@gmail.com', role: 'customer' };
    setUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));
    return { success: true };
  };

  const logoutUser = async () => {
    if (auth && user?.uid) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const updateUserProfile = async (name, phone) => {
    if (auth && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: name });
      } catch(e) {
        console.error(e);
      }
    }
    
    const updatedUser = { ...user, name, phone };
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, loginWithGoogle, logoutUser, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
