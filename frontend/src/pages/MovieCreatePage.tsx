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
    const { user } = useAuth();
    const isAuthenticated = !!user;
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
    const [validationState, setValidationState] = useState({
        title: { isValid: false, message: '' },
        genre: { isValid: false, message: '' },
        description: { isValid: false, message: '' }
    });
    const [filteredGenres, setFilteredGenres] = useState<string[]>([]);

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

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'title':
                if (!value) {
                    return { isValid: false, message: 'Title is required' };
                }
                if (value.length < 2 || value.length > 100) {
                    return { isValid: false, message: 'Title must be between 2 and 100 characters' };
                }
                if (!/^[0-9a-zA-ZæøåÆØÅ. \-]+$/.test(value)) {
                    return { isValid: false, message: 'Title can only contain letters, numbers, spaces, dots, and hyphens' };
                }
                return { isValid: true, message: 'Title is valid' };

            case 'genre':
                if (!value) {
                    return { isValid: false, message: 'Genre is required' };
                }
                if (value.length > 200) {
                    return { isValid: false, message: 'Genre cannot exceed 200 characters' };
                }
                return { isValid: true, message: 'Genre is valid' };

            case 'description':
                if (!value) {
                    return { isValid: false, message: 'Description is required' };
                }
                if (value.length < 2 || value.length > 1000) {
                    return { isValid: false, message: 'Description must be between 2 and 1000 characters' };
                }
                return { isValid: true, message: 'Description is valid' };

            default:
                return { isValid: false, message: '' };
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMovie(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationState(prev => ({
            ...prev,
            [name]: validateField(name, value)
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
        const { value } = e.target;
        setMovie(prev => ({
            ...prev,
            genre: value
        }));
        setGenreSearch(value);
        
        // Update validation state
        setValidationState(prev => ({
            ...prev,
            genre: validateField('genre', value)
        }));
        
        // Filter genres based on input - more like Google search
        if (value.trim()) {
            const filtered = filterGenres(genres, value);
            setFilteredGenres(filtered.slice(0, 8)); // Limit to 8 suggestions
        } else {
            setFilteredGenres([]);
        }
    };

    const handleGenreSelect = (genre: string) => {
        setMovie(prev => ({ ...prev, genre }));
        setGenreSearch('');
        setFilteredGenres([]);
        
        // Update validation after selection
        setValidationState(prev => ({
            ...prev,
            genre: validateField('genre', genre)
        }));
        
        // Focus on the next field after selection
        const nextField = document.querySelector('input[name="releaseDate"]');
        if (nextField instanceof HTMLElement) {
            nextField.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            console.log('Starting movie creation...', { user });
            
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

            await createMovie({
                title: movie.title || '',
                genre: movie.genre || '',
                releaseDate: movie.releaseDate || '',
                description: movie.description || '',
                image: image || undefined
            });
            navigate('/movies');
        } catch (err: any) {
            console.error('Movie creation error:', err);
            const errorMessage = err.response?.data?.message || 'Failed to create movie';
            setError(errorMessage);
            
            if (err.response?.status === 401) {
                console.log('Authentication error during movie creation');
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
                                isValid={validationState.title.isValid}
                                isInvalid={movie.title !== '' && !validationState.title.isValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationState.title.message}
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                                {validationState.title.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <GenreSelect
                            value={movie.genre || ''}
                            genres={genres}
                            genreSearch={genreSearch}
                            filteredGenres={filteredGenres}
                            onGenreChange={handleGenreChange}
                            onGenreSelect={handleGenreSelect}
                            isValid={validationState.genre.isValid}
                            isInvalid={movie.genre !== '' && !validationState.genre.isValid}
                            feedbackMessage={validationState.genre.message}
                        />

                        <Form.Group className="mb-3">
                            <Form.Label>Release Date</Form.Label>
                            <Form.Control
                                type="date"
                                id="releaseDate"
                                name="releaseDate"
                                value={movie.releaseDate || ''}
                                onChange={handleChange}
                                max="9999-12-31"
                                className="form-control"
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
                                isValid={validationState.description.isValid}
                                isInvalid={movie.description !== '' && !validationState.description.isValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                {validationState.description.message}
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                                {validationState.description.message}
                            </Form.Control.Feedback>
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