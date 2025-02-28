import axios from 'axios';
import API_URL from '../apiConfig';
import { Movie } from '../interfaces/movie';
import { CreateMovieData, UpdateMovieData } from '../interfaces/movie';

// Configure axios defaults
axios.defaults.withCredentials = true;

const checkAuthStatus = async () => {
  try {
    const response = await axios.get('/api/auth/status', { withCredentials: true });
    console.log('Auth status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
};

export const createMovie = async (movieData: any) => {
  try {
    console.log('Creating movie with data:', movieData);
    
    // Create FormData object
    const formData = new FormData();
    
    // Append data with exact field names matching the backend
    formData.append('Title', movieData.title);
    formData.append('Genre', movieData.genre);
    formData.append('ReleaseDate', movieData.releaseDate);
    formData.append('Description', movieData.description);
    
    if (movieData.image) {
      formData.append('Image', movieData.image);
    }
    
    // Log what we're sending
    console.log('Sending FormData:');
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    // Use native fetch to avoid axios transformation issues
    const response = await fetch('http://localhost:5023/api/Movies', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Movie created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createMovie:', error);
    throw error;
  }
};

export const fetchMovies = async (): Promise<Movie[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/Movies`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

export const rateMovie = async (movieId: number, score: number): Promise<void> => {
    try {
        await axios.post(
            `${API_URL}/api/Movies/${movieId}/rate`,
            { score },
            { withCredentials: true }
        );
    } catch (error) {
        console.error('Error rating movie:', error);
        throw error;
    }
};

export const updateMovie = async (movieData: UpdateMovieData): Promise<void> => {
    const formData = new FormData();
    formData.append('Title', movieData.title);
    formData.append('Genre', movieData.genre);
    formData.append('ReleaseDate', movieData.releaseDate);
    formData.append('Description', movieData.description);
    
    if (movieData.image) {
        formData.append('Image', movieData.image);
    }

    try {
        await axios.put(`${API_URL}/api/Movies/updateMovie?id=${movieData.id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            transformRequest: [(data) => data],
        });
    } catch (error) {
        console.error('Error updating movie:', error);
        throw error;
    }
};

export const deleteMovie = async (movieId: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/api/Movies/deleteMovie?id=${movieId}`, {
            withCredentials: true
        });
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
    }
};

export const fetchUserMovies = async (): Promise<Movie[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/Movies/user`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user movies:', error);
        throw error;
    }
};
