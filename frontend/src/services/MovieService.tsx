import API_URL from '../apiConfig.js';

const headers = {
  'Content-Type': 'application/json',
};

const handleResponse = async (response: Response) => {
  if (response.ok) {  // HTTP status code success 200-299
    if (response.status === 204) { // Detele returns 204 No content
      return null;
    }
    return response.json(); // other returns response body as JSON
  } else {
    const errorText = await response.text();
    throw new Error(errorText || 'Network response was not ok');
  }
};

// Get movieList
export const fetchMovies = async () => {
  const response = await fetch(`${API_URL}/api/Movies/movieList`);
  return handleResponse(response);
};
// Get movie by id
export const fetchMovieById = async (movieId: string) => {
  const response = await fetch(`${API_URL}/api/Movies/${movieId}`);
  return handleResponse(response);
};
// Post create movie
export const createMovie = async (movie: any) => {
  const response = await fetch(`${API_URL}/api/Movies/addMovie`, {
    method: 'POST',
    headers,
    body: JSON.stringify(movie),
  });
  return handleResponse(response);
};
// Put update movie
export const updateMovie = async (movieId: number, movie: any) => {
  const response = await fetch(`${API_URL}/api/Movies/updateMovie/${movieId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(movie),
  });
  return handleResponse(response);
};
// Delete item
export const deleteMovie = async (movieId: number) => {
  const response = await fetch(`${API_URL}/api/Movies/deleteMovie/${movieId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};