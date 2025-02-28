import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Movie, UpdateMovieForm } from '../interfaces/movie.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { updateMovie, deleteMovie, fetchUserMovies } from '../services/movieApiService.tsx';
import UpdateMovieModal from '../components/UpdateMovieModal.tsx';
import API_URL from '../apiConfig.js';

const MovieDetails: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const isAuthenticated = !!user;
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateForm, setUpdateForm] = useState<UpdateMovieForm | null>(null);
    const [updateError, setUpdateError] = useState('');

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchUserMovies();
                setMovies(data);
            } catch (err) {
                setError('Failed to fetch movies');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            loadMovies();
        }
    }, [isAuthenticated]);

    const handleDelete = async (movieId: number) => {
        try {
            await deleteMovie(movieId);
            setMovies(movies.filter(movie => movie.id !== movieId));
        } catch (err) {
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
            await updateMovie(updateForm);
            const updatedMovies = await fetchUserMovies();
            setMovies(updatedMovies);
            setShowUpdateModal(false);
            setUpdateError('');
        } catch (err) {
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

            <UpdateMovieModal
                show={showUpdateModal}
                updateForm={updateForm}
                updateError={updateError}
                onHide={() => setShowUpdateModal(false)}
                onSubmit={handleUpdateSubmit}
                onFormChange={updates => setUpdateForm(prev => prev ? { ...prev, ...updates } : null)}
            />
        </Container>
    );
};

export default MovieDetails;
