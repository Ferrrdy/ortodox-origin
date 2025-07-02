// src/contexts/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Gagal parsing user dari localStorage:", e);
        localStorage.removeItem('currentUser');
        setUser(null);
      }
    } else {
        setUser({ role: 'guest' });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('User logged in:', userData);
  };

  const logout = () => {
    setUser({ role: 'guest' });
    localStorage.removeItem('currentUser');
    console.log('User logged out');
  };

  const value = {
    user,
    userRole: user ? user.role : 'guest',
    isAuthenticated: !!user && user.role !== 'guest',
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};