import axios from 'axios';
import API_URL from '../apiConfig';
import { Movie } from '../interfaces/movie';
import { CreateMovieData, UpdateMovieData } from '../interfaces/movie';

// Configure axios defaults
axios.defaults.withCredentials = true;

export const createMovie = async (movieData: CreateMovieData): Promise<void> => {
    const formData = new FormData();
    formData.append('Title', movieData.title);
    formData.append('Genre', movieData.genre);
    formData.append('ReleaseDate', movieData.releaseDate || new Date().toISOString());
    formData.append('Description', movieData.description);
    
    if (movieData.image) {
        formData.append('Image', movieData.image);
    }

    try {
        await axios.post(`${API_URL}/api/Movies`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
            transformRequest: [(data) => data],
        });
    } catch (error) {
        console.error('Error creating movie:', error);
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
