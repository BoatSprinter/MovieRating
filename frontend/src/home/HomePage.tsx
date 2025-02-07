import React, { useEffect, useState } from 'react';
import { fetchMovies } from '../services/MovieService.tsx';
import { Movie } from '../interfaces/movie.tsx';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data);
      } catch (err) {
        setError('Failed to fetch movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  if (loading) return <p>Loading movies...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Movie List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="border rounded-lg shadow-lg p-4">
            <img src={movie.imageUrl} alt={movie.title} className="w-full h-64 object-cover rounded-md mb-2" />
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            <p className="text-gray-600">Genre: {movie.genre}</p>
            <p className="text-gray-600">Release Date: {movie.releaseDate}</p>
            <p className="text-yellow-500 font-bold">⭐ {movie.averageScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
