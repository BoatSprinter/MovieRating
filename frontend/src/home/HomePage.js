import React, { useState, useEffect } from 'react';
import { getMovies } from '../services/api';
import MovieForm from '../components/MovieForm';

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getMovies();
      setMovies(data); 
    };

    fetchMovies();
  }, []);

  return (
    <div>
      <h2>Movie List</h2>
      <MovieForm />
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            {movie.title} - {movie.genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
