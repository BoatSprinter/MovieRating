import React, { useState } from 'react';
import { createMovie } from '../services/api';

const MovieForm = () => {
  const [movie, setMovie] = useState({
    title: '',
    genre: '',
    releaseDate: '',
    description: '',
  });

  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createMovie(movie);
    alert('Movie created successfully!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={movie.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Genre</label>
        <input
          type="text"
          name="genre"
          value={movie.genre}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Release Date</label>
        <input
          type="date"
          name="releaseDate"
          value={movie.releaseDate}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="description"
          value={movie.description}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add Movie</button>
    </form>
  );
};

export default MovieForm;
