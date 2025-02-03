import axios from 'axios';

const API_BASE_URL = 'https://localhost:5299/api/movies';

export const getMovies = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data;
};

export const getMovieById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  return response.data;
};

export const createMovie = async (movie) => {
  const response = await axios.post(API_BASE_URL, movie);
  return response.data;
};

export const updateMovie = async (id, movie) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, movie);
  return response.data;
};

export const deleteMovie = async (id) => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};
