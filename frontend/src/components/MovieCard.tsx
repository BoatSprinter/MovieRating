import React, { useState } from 'react';
import { Card, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Movie } from '../interfaces/movie';
import API_URL from '../apiConfig';

interface MovieCardProps {
    movie: Movie;
    onRate: (movieId: number, score: number) => Promise<void>;
    ratingInProgress: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onRate, ratingInProgress }) => {
    const [showDetails, setShowDetails] = useState(false);

    const handleClose = () => setShowDetails(false);
    const handleShow = () => setShowDetails(true);

    return (
        <>
            <Card 
                className="h-100 shadow-sm border-0 movie-poster-card" 
                onClick={handleShow}
                style={{ cursor: 'pointer' }}
            >
                {movie.imagePath ? (
                    <Card.Img
                        src={`${API_URL}${movie.imagePath}`}
                        alt={movie.title}
                        style={{ 
                            width: '100%',
                            height: '100%',
                            aspectRatio: '2/3',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />
                ) : (
                    <div 
                        style={{ 
                            width: '100%',
                            aspectRatio: '2/3',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px'
                        }}
                    >
                        <span className="text-muted">No Image</span>
                    </div>
                )}
                <div 
                    className="position-absolute bottom-0 start-0 w-100 p-2 poster-bio" 
                    style={{ 
                        color: 'white',
                        borderBottomLeftRadius: '8px',
                        borderBottomRightRadius: '8px'
                    }}
                >
                    <h5 className="mb-0">{movie.title}</h5>
                    <div className="d-flex align-items-center">
                        <small>⭐ {movie.averageScore.toFixed(1)}</small>
                    </div>
                </div>
            </Card>

            <Offcanvas 
                show={showDetails} 
                onHide={handleClose} 
                placement="end"
                style={{
                    backgroundColor: 'rgb(194, 193, 193)', 
                    backgroundImage: 'var(--background-gradient)',
                    color: 'var(--text-color)'
                }}
                className="movie-details-offcanvas"
            >
                <Offcanvas.Header 
                    closeButton
                    style={{
                        borderBottom: '1px solid rgba(0, 0, 0, 0.11)'
                    }}
                >
                    <Offcanvas.Title>{movie.title}</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="mb-4">
                        {movie.imagePath && (
                            <img 
                                src={`${API_URL}${movie.imagePath}`}
                                alt={movie.title}
                                style={{ 
                                    width: '100%',
                                    maxHeight: '300px',
                                    objectFit: 'contain',
                                    marginBottom: '1rem',
                                    borderRadius: '8px',
                                    
                                }}
                            />
                        )}
                        <div className="mb-3">
                            <div><strong>Genre:</strong> {movie.genre}</div>
                            <div><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</div>
                            <div><strong>Rating:</strong> ⭐ {movie.averageScore.toFixed(1)} ({movie.ratingCount} ratings)</div>
                        </div>
                        <div className="mb-4">
                            <h5>Description</h5>
                            <p>{movie.description}</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h5>Rate this movie</h5>
                        <div className="d-flex gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((score) => (
                                <Button
                                    key={score}
                                    variant="outline-primary"
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
                        className="btn btn-primary w-100"
                    >
                        View Full Details
                    </Link>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default MovieCard;
