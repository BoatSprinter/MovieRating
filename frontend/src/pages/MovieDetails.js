import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieById } from '../services/api';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const data = await getMovieById(id);
      setMovie(data);
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{movie.title}</h2>
      <p>Genre: {movie.genre}</p>
      <p>Release Date: {new Date(movie.releaseDate).toDateString()}</p>
      <p>{movie.description}</p>
    </div>
  );
};

export default MovieDetails;
