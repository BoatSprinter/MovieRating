import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './theme.css';
import NavMenu from './shared/NavMenu.tsx';
import HomePage from './home/HomePage.tsx';
import MovieListPage from './pages/MovieListPage.tsx';
import MovieCreatePage from './pages/MovieCreatePage.tsx';
import MovieDetails from './pages/MovieDetails.tsx';
import { Container } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import AdminPage from './pages/AdminPage.tsx';
import MovieInfoPage from './pages/MovieInfoPage.tsx';

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) {
      console.log('ProtectedRoute: Not authenticated, redirecting to login');
      console.log('Current user state:', { user, loading });
      navigate('/login');
    }
  }, [user, loading, navigate]);
  
  if (loading) {
    console.log('ProtectedRoute: Loading...');
    return <div>Loading...</div>;
  }
  
  if (!user) {
    console.log('ProtectedRoute: No user, returning null');
    return null;
  }
  
  console.log('ProtectedRoute: Rendering protected content');
  return <>{children}</>;
};

// Admin route component
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  
  useEffect(() => {
    // Only make navigation decisions after loading is complete
    if (!loading) {
      console.log('AdminRoute check:', { isAuthenticated, isAdmin: user?.isAdmin, loading });
      
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        navigate('/login');
      } else if (!user?.isAdmin) {
        console.log('Not admin, redirecting to home');
        navigate('/');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);
  
  // Show loading state while checking auth
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Only render children if authenticated and admin
  if (isAuthenticated && user?.isAdmin) {
    return <>{children}</>;
  }
  
  return null;
};

// Animated routes component
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={
        <Container className="mt-4 animate-content">
          <MovieListPage />
        </Container>
      } />
      <Route path="/movies/create" element={
        <ProtectedRoute>
          <Container className="mt-4 animate-content">
            <MovieCreatePage />
          </Container>
        </ProtectedRoute>
      } />
      <Route path="/movies/details" element={
        <ProtectedRoute>
          <Container className="mt-4 animate-content">
            <MovieDetails />
          </Container>
        </ProtectedRoute>
      } />
      <Route path="/login" element={
        <Container className="mt-4 animate-content">
          <LoginPage />
        </Container>
      } />
      <Route path="/register" element={
        <Container className="mt-4 animate-content">
          <RegisterPage />
        </Container>
      } />
      <Route path="/admin" element={
        <AdminRoute>
          <AdminPage />
        </AdminRoute>
      } />
      <Route path="/movie/:id" element={<MovieInfoPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <NavMenu />
          <AnimatedRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
