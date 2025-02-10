import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../apiConfig';

interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  description: string;
  averageScore: number;
  imagePath: string;
}

const MovieListPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Movies/movieList`);
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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Movie List</h1>
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
                  <div><strong>Genre:</strong> {movie.genre}</div>
                  <div><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</div>
                  <div><strong>Rating:</strong> ⭐ {movie.averageScore}</div>
                  <div className="mt-2">
                    {movie.description?.length > 100
                      ? `${movie.description.substring(0, 100)}...`
                      : movie.description}
                  </div>
                </Card.Text>
                <Link 
                  to={`/movies/${movie.id}`} 
                  className="btn btn-primary"
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
