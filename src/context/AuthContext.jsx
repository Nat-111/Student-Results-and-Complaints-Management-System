import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { handleRedirectResult } from '../services/authService';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check redirect results in parallel
    handleRedirectResult().then(async redirectUser => {
      if (redirectUser) {
        try {
          const res = await api.get('/auth/user/');
          setUser({ ...redirectUser, ...res.data });
          setRole(res.data.role);
        } catch (e) {
          console.error("Backend auth state error:", e);
        }
        setLoading(false);
      }
    }).catch(err => console.error("Redirect check error:", err));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const res = await api.get('/auth/user/');
          setUser({ ...firebaseUser, ...res.data });
          setRole(res.data.role);
        } catch (e) {
          console.error("Error fetching user data from backend:", e);
          setUser(firebaseUser);
          setRole('student'); // Fallback to student access
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
