import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  
  return <>{children}</>;
};

export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('AdminRoute check:', { user, loading, isAdmin: user?.isAdmin });
    
    if (!loading) {
      if (!user) {
        console.log('Not authenticated, redirecting to login');
        navigate('/login');
      } else if (!user.isAdmin) {
        console.log('Not admin, redirecting to home');
        navigate('/');
      } else {
        console.log('User is admin, allowing access');
      }
    }
  }, [user, loading, navigate]);
  
  if (loading) return <div>Loading...</div>;
  if (!user?.isAdmin) return null;
  
  return <>{children}</>;
}; 