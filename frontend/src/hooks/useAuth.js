import { useState, useEffect } from 'react';
import { auth, googleProvider, db, isFirebaseConfigured } from '../firebase/config';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { validateEmailIntegrity } from '../utils/emailValidator';

function formatAuthError(error) {
  if (!error) return 'An unexpected authentication error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    default:
      return error.message || 'Authentication failed. Please check your credentials.';
  }
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync user profile from Firestore or Auth token
  useEffect(() => {
    // If running in demo mode without live credentials, check localStorage
    if (!isFirebaseConfigured) {
      const saved = localStorage.getItem('onlymeme_demo_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch (e) {
          localStorage.removeItem('onlymeme_demo_user');
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);

          let userData = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || 'Anonymous Memer',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
            emailVerified: firebaseUser.emailVerified,
            role: (
              firebaseUser.email?.toLowerCase() === (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase() ||
              firebaseUser.email?.toLowerCase() === 'adminrole@hotmail.com' ||
              firebaseUser.email === 'admin@onlymemes.culture' ||
              firebaseUser.email === 'admin@onlymeme.com'
            ) ? 'admin' : 'user',
            bio: 'Spreading laughter & high-entropy memes on OnlyMemes.',
            postsCount: 0,
            likesReceived: 0,
            createdAt: new Date().toISOString()
          };

          if (snap.exists()) {
            userData = { ...userData, ...snap.data() };
          } else {
            // Provision initial document in Firestore
            await setDoc(userDocRef, {
              ...userData,
              createdAt: serverTimestamp()
            });
          }

          setUser(userData);
        } catch (err) {
          console.warn('Firestore user fetch notice (using auth profile):', err);
          setUser({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            role: 'user',
            bio: 'Spreading laughter on OnlyMemes.',
            postsCount: 0,
            likesReceived: 0
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In with backend email validation
  const signInWithGoogle = async () => {
    setAuthError(null);

    // If no Firebase credentials provided, prompt demo sign-in
    if (!isFirebaseConfigured) {
      const demoUser = {
        uid: 'google_creator_99',
        displayName: 'NeonMemer',
        email: 'neon.creator@gmail.com',
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        role: 'user',
        bio: 'Internet archeologist & verified meme creator on OnlyMemes.',
        postsCount: 0,
        likesReceived: 0,
        emailVerified: true,
        createdAt: '2026-10-23'
      };
      localStorage.setItem('onlymeme_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      // Backend email validation: reject disposable domains & require verified provider status
      const validation = validateEmailIntegrity(fbUser.email, true, fbUser.emailVerified);
      if (!validation.isValid) {
        await fbSignOut(auth);
        setAuthError(validation.reason);
        throw new Error(validation.reason);
      }

      return fbUser;
    } catch (err) {
      console.error('Google sign-in error:', err);
      const message = formatAuthError(err);
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Email & Password Sign-In
  const signInWithEmail = async (email, password) => {
    setAuthError(null);

    // Backend-level email validation check
    const validation = validateEmailIntegrity(email, false);
    if (!validation.isValid) {
      setAuthError(validation.reason);
      throw new Error(validation.reason);
    }

    if (!password) {
      const msg = 'Please enter your password.';
      setAuthError(msg);
      throw new Error(msg);
    }

    if (!isFirebaseConfigured) {
      // Local demo account handler
      const demoUser = {
        uid: 'user_' + btoa(email.toLowerCase()).replace(/=/g, '').substring(0, 10),
        displayName: email.split('@')[0],
        email: email.trim().toLowerCase(),
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        role: email.includes('admin') ? 'admin' : 'user',
        bio: 'Spreading laughter & high-entropy memes on OnlyMemes.',
        postsCount: 0,
        likesReceived: 0,
        emailVerified: true,
        createdAt: '2026-10-23'
      };
      localStorage.setItem('onlymeme_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      return credential.user;
    } catch (err) {
      console.error('Email sign-in error:', err);
      const message = formatAuthError(err);
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Email & Password Sign-Up (Create Account)
  const signUpWithEmail = async (email, password, displayName) => {
    setAuthError(null);

    // Backend-level email validation check
    const validation = validateEmailIntegrity(email, false);
    if (!validation.isValid) {
      setAuthError(validation.reason);
      throw new Error(validation.reason);
    }

    if (!password || password.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setAuthError(msg);
      throw new Error(msg);
    }

    const cleanName = (displayName || '').trim() || email.split('@')[0];

    if (!isFirebaseConfigured) {
      // Local demo account handler
      const demoUser = {
        uid: 'user_' + btoa(email.toLowerCase()).replace(/=/g, '').substring(0, 10),
        displayName: cleanName,
        email: email.trim().toLowerCase(),
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        role: email.includes('admin') ? 'admin' : 'user',
        bio: 'Fresh creator on OnlyMemes.',
        postsCount: 0,
        likesReceived: 0,
        emailVerified: true,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('onlymeme_demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return demoUser;
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const fbUser = credential.user;

      if (cleanName) {
        await updateProfile(fbUser, { displayName: cleanName });
      }

      // Provision user document in Firestore
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userData = {
        uid: fbUser.uid,
        displayName: cleanName,
        email: fbUser.email,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        role: fbUser.email === 'admin@onlymemes.culture' ? 'admin' : 'user',
        bio: 'Fresh creator on OnlyMemes.',
        postsCount: 0,
        likesReceived: 0,
        createdAt: serverTimestamp()
      };
      await setDoc(userDocRef, userData);
      setUser({ ...userData, createdAt: new Date().toISOString() });
      return fbUser;
    } catch (err) {
      console.error('Email sign-up error:', err);
      const message = formatAuthError(err);
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Sign out
  const logOut = async () => {
    localStorage.removeItem('onlymeme_demo_user');
    if (isFirebaseConfigured) {
      await fbSignOut(auth);
    }
    setUser(null);
  };

  // Update User Bio
  const updateBio = async (newBio) => {
    if (!user) return;
    const updated = { ...user, bio: newBio };
    setUser(updated);

    if (!isFirebaseConfigured) {
      localStorage.setItem('onlymeme_demo_user', JSON.stringify(updated));
    } else {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { bio: newBio });
      } catch (e) {
        console.warn('Bio update notice:', e);
      }
    }
  };

  return {
    user,
    loading,
    authError,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logOut,
    updateBio,
    setAuthError
  };
}
