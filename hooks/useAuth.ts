import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth } from '../firebase/config';

// Define the allowed admin emails
const ADMIN_EMAILS = ['heng@gmail.com', 'sal@gmail.com', 'thun@gmail.com'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? user.uid : 'No user');
      setLoading(true);
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
        console.log('User authenticated:', user.uid, user.email);
        // Check if the user's email is in the ADMIN_EMAILS array
        setIsAdmin(user.email ? ADMIN_EMAILS.includes(user.email) : false);
      } else {
        console.log('No user authenticated');
        setUser(null);
        setIsAdmin(false);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = () => {
    console.log('Signing out');
    return firebaseSignOut(auth);
  };

  console.log('useAuth state:', { user: user?.email, isAdmin, loading, isAuthenticated });
  return { user, isAdmin, loading, isAuthenticated, signOut };
}
