import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './theme.css';
import NavMenu from './shared/NavMenu.tsx';
import HomePage from './home/HomePage.tsx';
import MovieListPage from './pages/MovieListPage.tsx';
import MovieCreatePage from './pages/MovieCreatePage.tsx';
import MovieDetails from './pages/MovieDetails.tsx';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';

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
        <Container className="mt-4 animate-content">
          <MovieCreatePage />
        </Container>
      } />
      <Route path="/movies/details" element={
        <Container className="mt-4 animate-content">
          <MovieDetails />
        </Container>
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
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <NavMenu />
          <AnimatedRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
