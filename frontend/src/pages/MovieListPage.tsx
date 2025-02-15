import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../apiConfig';
import { Movie } from '../interfaces/movie';
import { filterMovies, sortMovies } from '../services/movieFilterService.tsx';


const MovieListPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingInProgress, setRatingInProgress] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  const uniqueYears = [...new Set(movies.map(movie => 
    new Date(movie.releaseDate).getFullYear()
  ))].sort((a, b) => b - a);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Movies`);
        console.log('Movies response:', response.data);
        setMovies(response.data);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleRate = async (movieId: number, score: number) => {
    if (ratingInProgress) return;
    
    setRatingInProgress(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/api/Movies/${movieId}/rate`, {
        Score: score
      }, {
        withCredentials: true
      });
      
      // Refresh the movies list
      const response = await axios.get(`${API_URL}/api/Movies`);
      setMovies(response.data);
    } catch (err: any) {
      console.error('Error rating movie:', err);
      // Show error message if user has already rated
      if (err.response?.status === 400) {
        setError(err.response.data);
      } else {
        setError('Failed to rate movie');
      }

      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setRatingInProgress(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Movie List</h1>
      <div className="mb-4">
        <Row className="g-3">
          <Col md={4}>
            <InputGroup>
              <Form.Control
                placeholder="Search movies, genres..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Col>
          
          <Col md={4}>
            <InputGroup>
              <Form.Select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </Form.Select>
              {yearFilter && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => setYearFilter('')}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Col>
          
          <Col md={4}>
            <InputGroup>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">Sort By...</option>
                <option value="rating-high">Rating (High to Low)</option>
                <option value="rating-low">Rating (Low to High)</option>
                <option value="year-new">Year (Newest First)</option>
                <option value="year-old">Year (Oldest First)</option>
              </Form.Select>
              {sortBy && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => setSortBy('')}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Col>
        </Row>
      </div>
      {error && (
        <Alert 
          variant="danger" 
          dismissible 
          onClose={() => setError(null)}
          className="mb-4"
        >
          {error}
        </Alert>
      )}
      <Row xs={1} md={2} lg={3} className="g-4">
        {movies.map((movie) => (
          <Col key={movie.id}>
            <Card className="h-100 shadow-sm">
              {movie.imagePath && (
                <Card.Img
                  variant="top"
                  src={`${API_URL}${movie.imagePath}`}
                  alt={movie.title}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
              )}
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>
                  <div>
                    <strong>Genre:</strong> {movie.genres?.length > 0 
                      ? movie.genres.map(g => g.name).join(', ') 
                      : movie.genre}
                  </div>
                  <div><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</div>
                  <div><strong>Rating:</strong> ⭐ {movie.averageScore || 'No ratings yet'} ({movie.ratingCount})</div>
                  <div className="mt-2">
                    {movie.description?.length > 100
                      ? `${movie.description.substring(0, 100)}...`
                      : movie.description}
                  </div>
                </Card.Text>
                <div className="mt-3">
                  <p>Rate this movie:</p>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Button
                        key={score}
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleRate(movie.id, score)}
                        disabled={ratingInProgress}
                      >
                        {score} ⭐
                      </Button>
                    ))}
                  </div>
                </div>
                <Link 
                  to={`/movies/${movie.id}`} 
                  className="btn btn-primary mt-3"
                >
                  View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default MovieListPage;
