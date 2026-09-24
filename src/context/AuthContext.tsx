'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/services/api';

interface AdminUserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  // Customer
  user: User | null;
  customerToken: string | null;
  isLoading: boolean;
  loginCustomer: (email: string, password: string) => Promise<void>;
  registerCustomer: (data: { name: string; email: string; phone?: string; password: string }) => Promise<void>;
  logoutCustomer: () => void;

  // Admin
  admin: AdminUserSession | null;
  adminToken: string | null;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [customerToken, setCustomerToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUserSession | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from storage on client mount
  useEffect(() => {
    const handleInvalidAuth = (event: Event) => {
      const scope = (event as CustomEvent<{ scope?: string }>).detail?.scope;
      if (scope === 'admin') {
        setAdmin(null);
        setAdminToken(null);
      } else if (scope === 'customer') {
        setUser(null);
        setCustomerToken(null);
      }
    };
    const handleAuthRefreshed = (event: Event) => {
      const detail = (event as CustomEvent<{ accessToken?: string; user?: User }>).detail;
      if (detail?.accessToken) setCustomerToken(detail.accessToken);
      if (detail?.user) setUser(detail.user);
    };
    window.addEventListener('ellext:auth-invalid', handleInvalidAuth);
    window.addEventListener('ellext:auth-refreshed', handleAuthRefreshed);
    return () => {
      window.removeEventListener('ellext:auth-invalid', handleInvalidAuth);
      window.removeEventListener('ellext:auth-refreshed', handleAuthRefreshed);
    };
  }, []);

  // Initialize from storage on client mount
  useEffect(() => {
    async function initAuth() {
      try {
        const savedCustToken = localStorage.getItem('ellext_access_token');
        const savedCustUser = localStorage.getItem('ellext_customer_user');
        const savedRefreshToken = localStorage.getItem('ellext_refresh_token');
        if (savedCustToken || savedRefreshToken) {
          if (savedCustToken) setCustomerToken(savedCustToken);
          if (savedCustUser) {
            setUser(JSON.parse(savedCustUser));
          }
          // Verify with backend
          try {
            const profile = await api.getCustomerProfile();
            if (profile) {
              setUser(profile);
              localStorage.setItem('ellext_customer_user', JSON.stringify(profile));
            }
          } catch (e) {
            // Token might be expired or backend offline; keep stored session or clear if 401
          }
        }

        const savedAdminToken = localStorage.getItem('ellext_admin_token');
        const savedAdminUser = localStorage.getItem('ellext_admin_user');
        if (savedAdminToken && savedAdminUser) {
          setAdminToken(savedAdminToken);
          setAdmin(JSON.parse(savedAdminUser));
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const loginCustomer = async (email: string, password: string) => {
    const res = await api.loginCustomer({ email, password });
    if (!res.token || !res.refreshToken) throw new Error('Sign-in did not return a persistent session. Please try again.');
    setUser(res.user);
    setCustomerToken(res.token);
    localStorage.setItem('ellext_access_token', res.token);
    localStorage.setItem('ellext_refresh_token', res.refreshToken);
    localStorage.setItem('ellext_customer_user', JSON.stringify(res.user));
  };

  const registerCustomer = async (data: { name: string; email: string; phone?: string; password: string }) => {
    const res = await api.registerCustomer(data);
    if (!res.token || !res.refreshToken) {
      throw new Error('Your account was created, but Supabase did not start a session. To sign in automatically after registration, disable email confirmation in Supabase Auth settings.');
    }
    setUser(res.user);
    setCustomerToken(res.token);
    localStorage.setItem('ellext_access_token', res.token);
    localStorage.setItem('ellext_refresh_token', res.refreshToken);
    localStorage.setItem('ellext_customer_user', JSON.stringify(res.user));
  };

  const logoutCustomer = () => {
    setUser(null);
    setCustomerToken(null);
    localStorage.removeItem('ellext_access_token');
    localStorage.removeItem('ellext_refresh_token');
    localStorage.removeItem('ellext_customer_user');
  };

  const loginAdmin = async (email: string, password: string) => {
    const res = await api.loginAdmin({ email, password });
    setAdmin(res.admin);
    setAdminToken(res.token);
    localStorage.setItem('ellext_admin_token', res.token);
    localStorage.setItem('ellext_admin_user', JSON.stringify(res.admin));
  };

  const logoutAdmin = () => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem('ellext_admin_token');
    localStorage.removeItem('ellext_admin_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        customerToken,
        isLoading,
        loginCustomer,
        registerCustomer,
        logoutCustomer,
        admin,
        adminToken,
        loginAdmin,
        logoutAdmin
      }}
    >
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
