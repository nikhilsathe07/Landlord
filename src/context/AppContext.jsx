import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [rentPayments, setRentPayments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Real-time listeners for maintenance requests - simplified to avoid index issues
  useEffect(() => {
    if (!user) return;

    let q;
    if (user.role === 'tenant') {
      // Simple query without orderBy to avoid composite index requirement
      q = query(
        collection(db, 'maintenanceRequests'), 
        where('tenantId', '==', user.id)
      );
    } else {
      // For landlords, get all requests without filtering
      q = collection(db, 'maintenanceRequests');
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort on client side to avoid index requirements
      requests.sort((a, b) => {
        const dateA = a.dateSubmitted?.toDate?.() || new Date(a.dateSubmitted);
        const dateB = b.dateSubmitted?.toDate?.() || new Date(b.dateSubmitted);
        return dateB - dateA;
      });
      
      setMaintenanceRequests(requests);
    }, (error) => {
      console.error('Error fetching maintenance requests:', error);
      // Fallback to empty array on error
      setMaintenanceRequests([]);
    });

    return unsubscribe;
  }, [user]);

  // Real-time listeners for messages - simplified to avoid index issues
  useEffect(() => {
    if (!user) return;

    // Simple query without orderBy to avoid composite index requirement
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort on client side to avoid index requirements
      msgs.sort((a, b) => {
        const timeA = a.timestamp?.toDate?.() || new Date(a.timestamp);
        const timeB = b.timestamp?.toDate?.() || new Date(b.timestamp);
        return timeA - timeB;
      });
      
      setMessages(msgs);
    }, (error) => {
      console.error('Error fetching messages:', error);
      // Fallback to empty array on error
      setMessages([]);
    });

    return unsubscribe;
  }, [user]);

  // Real-time listeners for rent payments - simplified to avoid index issues
  useEffect(() => {
    if (!user) return;

    let q;
    if (user.role === 'tenant') {
      // Simple query without orderBy to avoid composite index requirement
      q = query(
        collection(db, 'rentPayments'),
        where('tenantId', '==', user.id)
      );
    } else {
      // For landlords, get all payments without filtering
      q = collection(db, 'rentPayments');
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort on client side to avoid index requirements
      payments.sort((a, b) => {
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateB - dateA;
      });
      
      setRentPayments(payments);
    }, (error) => {
      console.error('Error fetching rent payments:', error);
      // Fallback to empty array on error
      setRentPayments([]);
    });

    return unsubscribe;
  }, [user]);

  // Upload files to Firebase Storage
  const uploadFiles = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const storageRef = ref(storage, `maintenance/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    });
    
    return await Promise.all(uploadPromises);
  };

  // Add maintenance request
  const addMaintenanceRequest = async (requestData, files = []) => {
    try {
      setLoading(true);
      
      let imageUrls = [];
      if (files.length > 0) {
        imageUrls = await uploadFiles(files);
      }

      const newRequest = {
        ...requestData,
        tenantId: user.id,
        tenantName: user.name,
        tenantEmail: user.email,
        dateSubmitted: serverTimestamp(),
        status: 'pending',
        images: imageUrls,
        propertyId: 'property-1' // Default property for demo
      };

      const docRef = await addDoc(collection(db, 'maintenanceRequests'), newRequest);
      toast.success('Maintenance request submitted successfully!');
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding maintenance request:', error);
      toast.error('Error submitting request');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update maintenance request
  const updateMaintenanceRequest = async (requestId, updates) => {
    try {
      await updateDoc(doc(db, 'maintenanceRequests', requestId), {
        ...updates,
        lastUpdated: serverTimestamp()
      });
      toast.success('Request updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      toast.error('Error updating request');
      return { success: false, error: error.message };
    }
  };

  // Add message
  const addMessage = async (messageData) => {
    try {
      const newMessage = {
        ...messageData,
        timestamp: serverTimestamp(),
        read: false,
        participants: [messageData.senderId, messageData.receiverId]
      };

      await addDoc(collection(db, 'messages'), newMessage);
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message');
      return { success: false, error: error.message };
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (senderId) => {
    try {
      const q = query(
        collection(db, 'messages'),
        where('senderId', '==', senderId),
        where('receiverId', '==', user.id),
        where('read', '==', false)
      );

      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { read: true })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Update rent payment
  const updateRentPayment = async (paymentId, updates) => {
    try {
      await updateDoc(doc(db, 'rentPayments', paymentId), {
        ...updates,
        lastUpdated: serverTimestamp()
      });
      toast.success('Payment updated successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Error updating payment');
      return { success: false, error: error.message };
    }
  };

  // Add rent payment
  const addRentPayment = async (paymentData) => {
    try {
      await addDoc(collection(db, 'rentPayments'), {
        ...paymentData,
        createdAt: serverTimestamp()
      });
      toast.success('Payment record added!');
      return { success: true };
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error('Error adding payment');
      return { success: false, error: error.message };
    }
  };

  const value = {
    maintenanceRequests,
    messages,
    rentPayments,
    properties,
    loading,
    addMaintenanceRequest,
    updateMaintenanceRequest,
    addMessage,
    markMessagesAsRead,
    updateRentPayment,
    addRentPayment,
    uploadFiles
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};