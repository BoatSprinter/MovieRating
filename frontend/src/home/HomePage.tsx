import React, { useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Movie } from '../interfaces/movie';
import { fetchMovies } from '../services/movieApiService.tsx';
import MovieRow from '../components/MovieRow.tsx';

const HomePage: React.FC = () => {
    const { isAuthenticated, username } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await fetchMovies();
                setMovies(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to load movies. Please try again later.');
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    // Group movies by genre
    const moviesByGenre: Record<string, Movie[]> = {};
    movies.forEach(movie => {
        const genre = movie.genre.trim();
        if (!moviesByGenre[genre]) {
            moviesByGenre[genre] = [];
        }
        moviesByGenre[genre].push(movie);
    });

    // Sort each genre's movies by rating
    Object.keys(moviesByGenre).forEach(genre => {
        moviesByGenre[genre].sort((a, b) => b.averageScore - a.averageScore);
    });

    // Get top genres with most movies
    const topGenres = Object.keys(moviesByGenre)
        .sort((a, b) => moviesByGenre[b].length - moviesByGenre[a].length)
        .slice(0, 4);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="text-white">
            <div className="py-5 text-center hero-section animate-hero">
                <Container fluid className="px-4 px-md-5">
                    <h1 className="display-4 fw-bold mb-4">Welcome to Movie Rating</h1>
                    <p className="lead mb-4">Discover and rate your favorite movies</p>
                    {isAuthenticated ? (
                        <p className="mb-4">Welcome back, {username}!</p>
                    ) : (
                        <div>
                            <Link to="/login" className="btn btn-primary me-2">Login</Link>
                            <Link to="/register" className="btn btn-secondary">Register</Link>
                        </div>
                    )}
                </Container>
            </div>

            <div className="movie-section py-4 animate-content">
                <Container fluid className="px-4 px-md-5">
                    {error ? (
                        <div className="text-center text-danger">{error}</div>
                    ) : (
                        <>
                            {topGenres.map((genre) => (
                                <MovieRow 
                                    key={genre} 
                                    genre={genre} 
                                    movies={moviesByGenre[genre]} 
                                />
                            ))}

                            <div className="text-center mt-5">
                                <Link to="/movies" className="btn btn-primary btn-lg">
                                    Browse All Movies
                                </Link>
                            </div>
                        </>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default HomePage;
