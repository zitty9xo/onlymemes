import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration from environment variables or live project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDYpoINJB0loGHaMUBjptnPPGQ77KaaHoA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'onlymemes-14119.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'onlymemes-14119',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'onlymemes-14119.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '374678158343',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:374678158343:web:bb89c6275d90a005247ea2',
  measurementId: 'G-HXW1SB247H'
};

// Check if valid Firebase credentials are configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'onlymeme-app'
);

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
