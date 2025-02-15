import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavMenu from './shared/NavMenu.tsx';
import HomePage from './home/HomePage.tsx';
import MovieListPage from './pages/MovieListPage.tsx';
import MovieCreatePage from './pages/MovieCreatePage.tsx';
import MovieDetails from './pages/MovieDetails.tsx';
import { Container } from 'react-bootstrap';
import { AuthProvider } from './contexts/AuthContext.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavMenu />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MovieListPage />} />
            <Route path="/movies/create" element={<MovieCreatePage />} />
            <Route path="/movies/details" element={<MovieDetails />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
