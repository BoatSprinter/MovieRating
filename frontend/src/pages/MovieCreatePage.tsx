import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../apiConfig';
import { Movie } from '../interfaces/movie';
import { useAuth } from '../contexts/AuthContext.tsx';

const MovieCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [movie, setMovie] = useState<Partial<Movie>>({
    title: '',
    genre: '',
    releaseDate: '',
    description: '',
    imagePath: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovie(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5000000) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }

      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('Title', movie.title || '');
    formData.append('Genre', movie.genre || '');
    formData.append('ReleaseDate', movie.releaseDate || new Date().toISOString());
    formData.append('Description', movie.description || '');
    
    if (image) {
        formData.append('Image', image);
    }

    try {
        const response = await axios.post(`${API_URL}/api/Movies`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            transformRequest: [(data) => data], // Prevent axios from JSON stringifying the FormData
        });
        
        if (response.status === 201 || response.status === 200) {
            navigate('/movies');
        }
    } catch (err: any) {
        console.error('Error creating movie:', err);
        if (err.response?.data) {
            const errorMessage = err.response.data.message || 'Failed to create movie';
            setError(errorMessage);
        } else {
            setError('Failed to create movie');
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header as="h4" className="bg-primary text-white">
          Add New Movie
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={movie.title}
                onChange={handleChange}
                required
                placeholder="Enter movie title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                name="genre"
                value={movie.genre}
                onChange={handleChange}
                required
                placeholder="Enter genre"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
                type="date"
                name="releaseDate"
                value={movie.releaseDate}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={movie.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter movie description"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Movie Poster</Form.Label>
              <div className="d-flex flex-column align-items-center">
                {previewUrl && (
                  <Image 
                    src={previewUrl} 
                    alt="Preview" 
                    className="mb-3" 
                    style={{ maxHeight: '200px', objectFit: 'contain' }} 
                  />
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                </Form.Text>
              </div>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Movie'}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/movies')}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MovieCreatePage;