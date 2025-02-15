import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { fetchMovies, rateMovie } from '../services/movieApiService.tsx';
import { Movie } from '../interfaces/movie';
import MovieCard from '../components/MovieCard.tsx';
import { filterMovies, sortMovies } from '../components/movieListFilter.tsx';

const MovieListPage: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [ratingInProgress, setRatingInProgress] = useState(false);

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true);
            try {
                const data = await fetchMovies();
                setMovies(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch movies');
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    const handleRate = async (movieId: number, score: number) => {
        if (ratingInProgress) return;
        setRatingInProgress(true);
        try {
            await rateMovie(movieId, score);
            const updatedMovies = await fetchMovies();
            setMovies(updatedMovies);
        } catch (err) {
            setError('Failed to rate movie');
        } finally {
            setRatingInProgress(false);
        }
    };

    const uniqueYears = [...new Set(movies.map(movie => 
        new Date(movie.releaseDate).getFullYear()
    ))].sort((a, b) => b - a);

    const filteredMovies = sortMovies(
        filterMovies(movies, searchTerm, yearFilter),
        sortBy
    );

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container>
            <div className="mb-4">
                <Row className="g-3">
                    <Col md={4}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <Form.Select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                        >
                            <option value="">All Years</option>
                            {uniqueYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={4}>
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
                    </Col>
                </Row>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Row xs={1} md={2} lg={3} className="g-4">
                {filteredMovies.map((movie) => (
                    <Col key={movie.id}>
                        <MovieCard
                            movie={movie}
                            onRate={handleRate}
                            ratingInProgress={ratingInProgress}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default MovieListPage;
