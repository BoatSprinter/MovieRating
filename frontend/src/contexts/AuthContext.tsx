import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

interface User {
  id: number | string;
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  error: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Set up Axios
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;

  // Check if user is logged in
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/Auth/check', { withCredentials: true });
        
        if (response.data.isAuthenticated) {
          console.log('Auth verified on load:', response.data);
          setUser({
            id: response.data.userId,
            username: response.data.username,
            isAdmin: response.data.isAdmin || false
          });
        } else {
          console.log('Not authenticated on load');
          setUser(null);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const debugAuthState = () => {
    console.log('Current auth state:', { 
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.isAdmin
    });
  };

  const login = async (username: string, password: string) => {
    try {
      setError('');
      console.log("Attempting login for:", username);
      const response = await axios.post('/api/Auth/login', { username, password });
      console.log("Login response:", response.data);
      
      const id = response.data.userId || 0;
      const isAdmin = response.data.isAdmin || false;
      console.log('Login successful:', { username, id, isAdmin });
      
      setUser({ id, username, isAdmin });
      debugAuthState();
    } catch (err: any) {
      console.error("Login error details:", err);
      if (err.response?.data) {
        // Handle specific error cases for approval status
        if (err.response.status === 401 && 
            (err.response.data.includes('pending approval') || 
             err.response.data.includes('has been rejected'))) {
          setError(err.response.data);
        } else {
          setError(err.response.data);
        }
      } else {
        setError('Login failed. Please try again.');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const register = async (userData: any) => {
    try {
      setError('');
      await axios.post('/api/auth/register', userData);
      // Don't automatically log in after registration - wait for approval
      setError('');
    } catch (err: any) {
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.title) {
          setError(err.response.data.title);
        } else {
          setError('Registration failed');
        }
      } else {
        setError('Registration failed');
      }
      throw err;
    }
  };

 

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      error, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 