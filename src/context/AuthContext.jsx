import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            });
          } else {
            // If no user document exists, create a basic one
            const userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              role: 'tenant', // Default role
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            role: 'tenant'
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, name, role = 'tenant') => {
    try {
      setLoading(true);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(firebaseUser, { displayName: name });
      
      // Create user document in Firestore
      const userData = {
        id: firebaseUser.uid,
        name,
        email,
        role,
        phone: '',
        address: '',
        emergencyContact: '',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      setUser(userData);
      
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (!user) return;
      
      await updateDoc(doc(db, 'users', user.id), profileData);
      setUser(prev => ({ ...prev, ...profileData }));
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Error updating profile');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    signup,
    login,
    logout,
    updateProfile: updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};