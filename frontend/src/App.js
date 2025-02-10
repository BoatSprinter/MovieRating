import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NavMenu from './shared/NavMenu.tsx';
import HomePage from './home/HomePage.tsx';
import MovieListPage from './pages/MovieListPage.tsx';
import MovieCreatePage from './pages/MovieCreatePage';
import MovieDetails from './pages/MovieDetails';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <div className="app-wrapper">
      <Router>
        <NavMenu />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MovieListPage />} />
            <Route path="/movies/create" element={<MovieCreatePage />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}

export default App;
