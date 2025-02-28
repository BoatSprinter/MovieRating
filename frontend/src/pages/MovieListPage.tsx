import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchMovies, rateMovie } from '../services/movieApiService.tsx';
import { Movie } from '../interfaces/movie';
import MovieCard from '../components/MovieCard.tsx';
import { filterMovies, sortMovies } from '../components/movieListFilter.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';


const MovieListPage: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [ratingInProgress, setRatingInProgress] = useState(false);
    const { isAuthenticated } = useAuth();

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
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="mb-0 text-color">Movies</h1>
                {isAuthenticated && (
                    <Link to="/movies/create" className="btn btn-success">
                        Add New Movie
                    </Link>
                )}
            </div>

            <div className="mb-4 p-3 search-filter-container rounded shadow-sm">
                <Row className="g-3">
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text className="search-icons">
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Search movies, genres, etc."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                                style={{ boxShadow: 'none' }}
                            />
                            {searchTerm && (
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => setSearchTerm('')}
                                >
                                    ×
                                </Button>
                            )}
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text className="search-icons">
                                <FaFilter className="text-muted" />
                            </InputGroup.Text>
                            <Form.Select
                                value={yearFilter}
                                onChange={(e) => setYearFilter(e.target.value)}
                                className="border-start-0"
                                style={{ boxShadow: 'none' }}
                            >
                                <option value="">All Years</option>
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </Form.Select>
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <InputGroup.Text className="search-icons">
                                <FaSortAmountDown className="text-muted" />
                            </InputGroup.Text>
                            <Form.Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border-start-0"
                                style={{ boxShadow: 'none' }}
                            >
                                <option value="">Sort By...</option>
                                <option value="rating-high">Rating (High to Low)</option>
                                <option value="rating-low">Rating (Low to High)</option>
                                <option value="year-new">Year (Newest First)</option>
                                <option value="year-old">Year (Oldest First)</option>
                            </Form.Select>
                        </InputGroup>
                    </Col>
                </Row>
            </div>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {filteredMovies.length === 0 ? (
                <div className="text-center py-5">
                    <h4 className="text-muted">No movies found</h4>
                    <p>Try adjusting your search or filters</p>
                </div>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
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
            )}
        </Container>
    );
};

export default MovieListPage;
