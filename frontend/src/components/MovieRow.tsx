import React, { useEffect, useRef } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Movie } from '../interfaces/movie';
import API_URL from '../apiConfig';

interface MovieRowProps {
  genre: string;
  movies: Movie[];
}

const MovieRow: React.FC<MovieRowProps> = ({ genre, movies }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    const leftIndicator = row?.parentElement?.querySelector('.scroll-indicator.left');
    const rightIndicator = row?.parentElement?.querySelector('.scroll-indicator.right');
    
    if (row && leftIndicator && rightIndicator) {
      const handleLeftClick = () => {
        row.scrollBy({ left: -800, behavior: 'smooth' });
      };
      
      const handleRightClick = () => {
        row.scrollBy({ left: 800, behavior: 'smooth' });
      };
      
      const handleScroll = () => {
        if (row.scrollLeft <= 0) {
          leftIndicator.classList.add('d-none');
        } else {
          leftIndicator.classList.remove('d-none');
        }
        
        if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 10) {
          rightIndicator.classList.add('d-none');
        } else {
          rightIndicator.classList.remove('d-none');
        }
      };
      
      leftIndicator.addEventListener('click', handleLeftClick);
      rightIndicator.addEventListener('click', handleRightClick);
      row.addEventListener('scroll', handleScroll);
      
      // Initial check
      handleScroll();
      
      return () => {
        leftIndicator.removeEventListener('click', handleLeftClick);
        rightIndicator.removeEventListener('click', handleRightClick);
        row.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="mb-5 animate-row">
      <div className="d-flex justify-content-between align-items-center mb-3 px-2">
        <h2 className="h4">{genre} Movies</h2>
        <Link 
          to={`/movies?genre=${genre}`} 
          className="text-decoration-none see-all-link"
        >
          See all <i className="bi bi-arrow-right"></i>
        </Link>
      </div>
      <div className="movie-row">
        <div className="position-relative">
          <Row 
            ref={rowRef}
            className="flex-nowrap overflow-auto g-3 pb-2 scrollable-row" 
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.3) transparent',
              msOverflowStyle: 'none',
              paddingBottom: '15px'
            }}
          >
            {movies.map(movie => (
              <Col key={movie.id} xs={6} sm={4} md={3} lg={2} className="flex-shrink-0">
                <Link to={'/movies/'} className="text-decoration-none">
                  <div className="position-relative movie-card">
                    {movie.imagePath ? (
                      <img 
                        src={`${API_URL}${movie.imagePath}`} 
                        alt={movie.title}
                        className="img-fluid rounded"
                        style={{ 
                          aspectRatio: '2/3',
                          objectFit: 'cover',
                          width: '100%'
                        }}
                      />
                    ) : (
                      <div 
                        className="bg-secondary rounded d-flex align-items-center justify-content-center"
                        style={{ 
                          aspectRatio: '2/3',
                          width: '100%'
                        }}
                      >
                        <span>No Image</span>
                      </div>
                    )}
                    <div className="position-absolute bottom-0 start-0 w-100 p-2 poster-bio" style={{ 
                      borderBottomLeftRadius: '0.25rem',
                      borderBottomRightRadius: '0.25rem'
                    }}>
                      <h5 className="text-white small mb-0">{movie.title}</h5>
                      <div className="d-flex align-items-center">
                        <small className="text-warning">⭐ {movie.averageScore.toFixed(1)}</small>
                      </div>
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>
          <div className="scroll-indicator-container">
            <div className="scroll-indicator left d-none d-md-flex">
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>←</span>
            </div>
            <div className="scroll-indicator right d-none d-md-flex">
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>→</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieRow; 