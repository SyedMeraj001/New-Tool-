// AuthContext.js - Secure Authentication Context (Cookie-based, no localStorage)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status via HTTP-only cookie
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        // Store minimal info in sessionStorage for quick access (cleared on tab close)
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userRole', data.user.role);
        sessionStorage.setItem('currentUser', data.user.email);
        sessionStorage.setItem('userFullName', data.user.fullName);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.clear();
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout - clear cookie and state
  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.clear();
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    isAuthenticated,
    checkAuth,
    logout,
    hasPermission: (permission) => {
      if (!user) return false;
      const rolePermissions = {
        super_admin: ['full_access', 'manage_users', 'authorize_data', 'view_all'],
        supervisor: ['view_reports', 'edit_data', 'view_analytics'],
        data_entry: ['view_dashboard', 'update_data']
      };
      const perms = rolePermissions[user.role] || [];
      return perms.includes(permission) || perms.includes('full_access');
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
