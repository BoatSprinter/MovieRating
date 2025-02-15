import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../apiConfig';
import { Movie } from '../interfaces/movie';
import { useAuth } from '../contexts/AuthContext.tsx';
import { getUniqueGenres, filterGenres } from '../services/genreFilterService.tsx';
import { validateImage, createImagePreview } from '../services/imageService.tsx';
import GenreSelect from '../components/GenreSelect.tsx';
import { createMovie } from '../services/movieApiService.tsx';
import { validateMovie } from '../utils/movieValidation.tsx';

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
    const [genres, setGenres] = useState<string[]>([]);
    const [genreSearch, setGenreSearch] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/Movies`);
                const uniqueGenres = getUniqueGenres(response.data);
                setGenres(uniqueGenres);
            } catch (err) {
                console.error('Error fetching genres:', err);
            }
        };
        fetchGenres();
    }, []);

    const filteredGenres = filterGenres(genres, genreSearch);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMovie(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateImage(file);
        if (!validation.isValid) {
            setError(validation.error || 'Invalid image');
            return;
        }

        try {
            const preview = await createImagePreview(file);
            setImage(file);
            setPreviewUrl(preview);
            setError('');
        } catch (err) {
            setError('Failed to process image');
            console.error('Image processing error:', err);
        }
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        setGenreSearch(e.target.value);
    };

    const handleGenreSelect = (genre: string) => {
        setMovie(prev => ({ ...prev, genre }));
        setGenreSearch('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const validationErrors = validateMovie({
            title: movie.title || '',
            genre: movie.genre || '',
            description: movie.description || ''
        });

        if (validationErrors.length > 0) {
            setError(validationErrors.join('\n'));
            setLoading(false);
            return;
        }

        try {
            await createMovie({
                title: movie.title || '',
                genre: movie.genre || '',
                releaseDate: movie.releaseDate || '',
                description: movie.description || '',
                image: image || undefined
            });
            navigate('/movies');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to create movie';
            setError(errorMessage);
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

                        <GenreSelect
                            value={movie.genre || ''}
                            genres={genres}
                            genreSearch={genreSearch}
                            filteredGenres={filteredGenres}
                            onGenreChange={handleGenreChange}
                            onGenreSelect={handleGenreSelect}
                        />

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