import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import API_URL from '../apiConfig';
import { Movie } from '../interfaces/movie';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Link } from 'react-router-dom';

// Add this interface for the update form
interface UpdateMovieForm {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  description: string;
  image: File | null;
}

const MovieDetails: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState<UpdateMovieForm | null>(null);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/Movies/user`, {
          withCredentials: true
        });
        console.log('Fetched movies:', response.data);
        setMovies(response.data);
      } catch (err) {
        setError('Failed to fetch movies');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMovies();
    }
  }, [isAuthenticated]);

  const handleDelete = async (movieId: number) => {
    try {
      await axios.delete(`${API_URL}/api/Movies/deleteMovie?id=${movieId}`, {
        withCredentials: true
      });
      
      // Remove the deleted movie from the state
      setMovies(movies.filter(movie => movie.id !== movieId));
    } catch (err) {
      console.error('Error deleting movie:', err);
      setError('Failed to delete movie');
    }
  };

  const handleShowUpdateModal = (movie: Movie) => {
    setUpdateForm({
      id: movie.id,
      title: movie.title,
      genre: movie.genre,
      releaseDate: new Date(movie.releaseDate).toISOString().split('T')[0],
      description: movie.description,
      image: null
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateForm) return;

    try {
      const formData = new FormData();
      formData.append('Title', updateForm.title);
      formData.append('Genre', updateForm.genre);
      formData.append('ReleaseDate', updateForm.releaseDate);
      formData.append('Description', updateForm.description);
      if (updateForm.image) {
        formData.append('Image', updateForm.image);
      }

      await axios.put(`${API_URL}/api/Movies/updateMovie?id=${updateForm.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        transformRequest: [(data) => data], // Prevent axios from JSON stringifying the FormData
      });

      // Refresh movies list
      const response = await axios.get(`${API_URL}/api/Movies/user`, {
        withCredentials: true
      });
      setMovies(response.data);
      setShowUpdateModal(false);
    } catch (err) {
      console.error('Error updating movie:', err);
      setUpdateError('Failed to update movie');
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to view your movies</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <h1 className="mb-4">My Movies</h1>
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
                  <div><strong>Rating:</strong> ⭐ {movie.averageScore || 'No ratings yet'}</div>
                  <div className="mt-2">
                    {movie.description?.length > 100
                      ? `${movie.description.substring(0, 100)}...`
                      : movie.description}
                  </div>
                </Card.Text>
                <div className="d-flex gap-2 mt-3">
                  <Button 
                    variant="primary"
                    onClick={() => handleShowUpdateModal(movie)}
                  >
                    Update
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Update Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {updateError && <div className="alert alert-danger">{updateError}</div>}
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={updateForm?.title || ''}
                onChange={e => updateForm && setUpdateForm({
                  ...updateForm,
                  title: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                value={updateForm?.genre || ''}
                onChange={e => updateForm && setUpdateForm({
                  ...updateForm,
                  genre: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                type="date"
                value={updateForm?.releaseDate || ''}
                onChange={e => updateForm && setUpdateForm({
                  ...updateForm,
                  releaseDate: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updateForm?.description || ''}
                onChange={e => updateForm && setUpdateForm({
                  ...updateForm,
                  description: e.target.value
                })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Image (optional)</Form.Label>
              <Form.Control
                type="file"
                onChange={e => updateForm && setUpdateForm({
                  ...updateForm,
                  image: (e.target as HTMLInputElement).files?.[0] || null
                })}
                accept="image/*"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update Movie
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MovieDetails;
