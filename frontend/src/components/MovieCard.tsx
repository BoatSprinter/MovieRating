import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Movie } from '../interfaces/movie';
import API_URL from '../apiConfig';

interface MovieCardProps {
    movie: Movie;
    onRate: (movieId: number, score: number) => Promise<void>;
    ratingInProgress: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onRate, ratingInProgress }) => {
    return (
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
                    <div><strong>Rating:</strong> ⭐ {movie.averageScore.toFixed(1)} ({movie.ratingCount} ratings)</div>
                    <div className="mt-2">{movie.description}</div>
                </Card.Text>
                <div className="mt-3">
                    <p>Rate this movie:</p>
                    <div className="d-flex gap-2">
                        {[1, 2, 3, 4, 5].map((score) => (
                            <Button
                                key={score}
                                variant="outline-primary"
                                size="sm"
                                onClick={() => onRate(movie.id, score)}
                                disabled={ratingInProgress}
                            >
                                {score} ⭐
                            </Button>
                        ))}
                    </div>
                </div>
                <Link 
                    to={`/movies/${movie.id}`} 
                    className="btn btn-primary mt-3"
                >
                    View Details
                </Link>
            </Card.Body>
        </Card>
    );
};

export default MovieCard;
