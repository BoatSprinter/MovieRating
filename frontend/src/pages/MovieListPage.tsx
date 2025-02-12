import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../apiConfig';


//remove the interface and use import /// remember to do so 
interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  description: string;
  averageScore: number;
  imagePath: string;
}

interface Rating {
  movieId: number;
  score: number;
}

const MovieListPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    try {
      await axios.post(`${API_URL}/api/Ratings`, {
        MovieId: movieId,
        Score: score
      });
      
      // Refresh the movies list to get updated average
      const response = await axios.get(`${API_URL}/api/Movies`);
      setMovies(response.data);
    } catch (err) {
      console.error('Error rating movie:', err);
      setError('Failed to rate movie');
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
                <div className="mt-3">
                  <p>Rate this movie:</p>
                  <div className="d-flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <Button
                        key={score}
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleRate(movie.id, score)}
                      >
                        {score} ⭐
                      </Button>
                    ))}
                  </div>
                </div>
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
