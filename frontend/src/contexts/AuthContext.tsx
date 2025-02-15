import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Auth/check`, { 
          withCredentials: true 
        });
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUsername(response.data.username);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUsername(null);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/Auth/login`, 
        { 
          username, 
          password 
        }, 
        { 
          withCredentials: true 
        }
      );
      console.log('Login response:', response);
      setIsAuthenticated(true);
      setUsername(username);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Login failed');
    }
  };

  const register = async (username: string, password: string, confirmPassword: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/Auth/register`, {
        username,
        password,
        confirmPassword
      });
      console.log('Registration response:', response);
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/Auth/logout`, {}, { 
        withCredentials: true 
      });
      setIsAuthenticated(false);
      setUsername(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, register, logout }}>
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