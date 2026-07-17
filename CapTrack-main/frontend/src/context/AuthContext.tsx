import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, email: string, name?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedEmail = localStorage.getItem('email');
    const storedName = localStorage.getItem('name');
    return storedEmail ? { email: storedEmail, name: storedName || undefined } : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    const storedName = localStorage.getItem('name');

    if (storedToken && storedEmail) {
      try {
        const decoded: any = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(storedToken);
          setUser({ email: storedEmail, name: storedName || undefined });
        }
      } catch (e) {
        logout();
      }
    }
  }, []);

  const login = (newToken: string, email: string, name?: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('email', email);
    if (name) localStorage.setItem('name', name);
    
    setToken(newToken);
    setUser({ email, name });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
