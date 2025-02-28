import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating';
import { getMovie, addComment } from '../services/movieApiService.tsx';


interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseDate: string;
  description: string;
  imagePath: string;
  averageScore: number;
  ratingCount: number;
  comments: Comment[];
}

interface Comment {
  id: number;
  text: string;
  authorName: string;
  createdAt: string;
}

const MovieInfoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingInProgress, setRatingInProgress] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const movieData = await getMovie(Number(id));
        setMovie(movieData);
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      await addComment(Number(id), { text: comment, authorName: authorName || 'Anonymous' });
      
      // Refresh movie data to get updated comments
      const updatedMovie = await getMovie(Number(id));
      setMovie(updatedMovie);
      
      // Clear form
      setComment('');
      setAuthorName('');
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Add rating handler
  const handleRating = async (rate: number) => {
    try {
      setRatingInProgress(true);
      // Add your rating API call here
      await axios.post(`/api/Movies/${id}/rate`, { score: rate });
      
      // Refresh movie data to get updated rating
      const updatedMovie = await getMovie(Number(id));
      setMovie(updatedMovie);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating');
    } finally {
      setRatingInProgress(false);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return <div className="alert alert-danger m-5 text-center">{error}</div>;
  if (!movie) return <div className="alert alert-warning m-5 text-center">Movie not found</div>;

  return (
    <div className="container py-5">
      {/* Movie Header Section with title and basic info */}
      <div className="mb-5">
        <h1 className="display-4 fw-bold mb-2">{movie.title}</h1>
      </div>

      {/* Movie Content Section - With Poster in 2:3 ratio */}
      <div className="row gy-4 mb-5">
        <div className="col-lg-4">
          {movie.imagePath ? (
            <div className="position-relative" style={{paddingBottom: '150%', overflow: 'hidden'}}>
              <img 
                src={`http://localhost:5023${movie.imagePath}`} 
                alt={movie.title}
                className="position-absolute w-100 h-100 rounded-3 shadow-sm"
                style={{objectFit: 'cover', objectPosition: 'center'}}
              />
            </div>
          ) : (
            <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{height: '450px'}}>
              <div className="text-center text-muted">
                <i className="bi bi-film fs-1 mb-2"></i>
                <p>No Image Available</p>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100 rounded-3">
            <div className="card-header bg-transparent border-0 pt-4 pb-0 px-4">
              <h3 className="mb-0">Movie Details</h3>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="detail-item">
                    <h6 className="text-uppercase text-muted mb-2">Release Date</h6>
                    <p className="fs-5">{new Date(movie.releaseDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <h6 className="text-uppercase text-muted mb-2">Genre</h6>
                    <p className="fs-5">
                      <span className="badge bg-secondary rounded-pill">{movie.genre}</span>
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <h6 className="text-uppercase text-muted mb-2">Rating</h6>
                    <p className="fs-5 d-flex align-items-center">
                      <span className="text-warning px-2 py-1 rounded d-inline-flex align-items-center me-2" 
                            style={{minWidth: '60px', backgroundColor: '#000000'}}>
                        <i className="bi bi-star-fill me-1 text-warning"></i>
                        {movie.averageScore.toFixed(1)}
                      </span>
                      <span className="text-muted">
                        ({movie.ratingCount} {movie.ratingCount === 1 ? 'rating' : 'ratings'})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="detail-item">
                    <h6 className="text-uppercase text-muted mb-2">Description</h6>
                    <p>{movie.description}</p>
                  </div>
                </div>
                
                {/* Full Stars Rating Section */}
                <div className="col-12 mt-3">
                  <hr className="my-3" />
                  <h6 className="text-uppercase text-muted mb-2">Rate This Movie</h6>
                  <div className="d-flex align-items-center">
                    <Rating
                      onClick={handleRating}
                      initialValue={rating}
                      size={30}
                      transition
                    />
                    {ratingInProgress && (
                      <span className="spinner-border spinner-border-sm ms-3" role="status"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fs-3 fw-bold m-0">Comments</h2>
          <span className="badge bg-secondary rounded-pill">
            {movie.comments?.length || 0}
          </span>
        </div>
        
        <div className="card border-0 shadow-sm mb-4 rounded-3">
          <div className="card-body p-4">
            <h5 className="card-title mb-3">Leave a comment</h5>
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="form-control form-control-lg"
                />
              </div>
              <div className="mb-3">
                <textarea
                  placeholder="Share your thoughts about this movie..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="form-control form-control-lg"
                  rows={3}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg px-4"
                disabled={submitting || !comment.trim()}
              >
                {submitting ? 
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</> : 
                  'Post Comment'}
              </button>
            </form>
          </div>
        </div>

        {movie.comments && movie.comments.length > 0 ? (
          <div className="comment-list">
            {movie.comments.map((comment) => (
              <div key={comment.id} className="card border-0 shadow-sm mb-3 rounded-3">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle p-2 me-2 text-primary">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <strong>{comment.authorName}</strong>
                    </div>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                  <p className="mb-0 ps-4">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card border-0 bg-light shadow-sm p-4 text-center rounded-3">
            <p className="text-muted mb-0 fst-italic">
              <i className="bi bi-chat-square-text me-2"></i>
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieInfoPage; 