import React, { useEffect, useState } from 'react';
import { fetchMovies } from '../services/MovieService.tsx';
import { Movie } from '../interfaces/movie.tsx';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  if (loading) return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h1 className="text-center mb-4">Featured Movies</h1>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {movies.map((movie) => (
          <Col key={movie.id}>
            <Card className="h-100">
              <Card.Img 
                variant="top" 
                src={movie.imageUrl} 
                alt={movie.title}
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>
                  <div>Genre: {movie.genre}</div>
                  <div>Release Date: {movie.releaseDate}</div>
                  <div className="text-warning">⭐ {movie.averageScore}</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomePage;
