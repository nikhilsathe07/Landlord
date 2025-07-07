// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCexMmtqf3kg5SqyG1k7fsz_tdVfLRSFUY",
  authDomain: "landlord-cefa7.firebaseapp.com",
  projectId: "landlord-cefa7",
  storageBucket: "landlord-cefa7.firebasestorage.app",
  messagingSenderId: "851481611964",
  appId: "1:851481611964:web:a05a149918b7882a8e4ab9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;