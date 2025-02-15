import { Movie } from '../interfaces/movie';

// Get unique genres from movies
export const getUniqueGenres = (movies: Movie[]): string[] => {
    return [...new Set(movies.map(movie => movie.genre))];
};

// Filter and sort genres based on search term
export const filterGenres = (genres: string[], searchTerm: string): string[] => {
    if (!searchTerm) return genres;
    
    const searchLower = searchTerm.toLowerCase();
    
    return genres
        .filter(genre => genre.toLowerCase().includes(searchLower))
        .sort((a, b) => {
            // Exact match first
            if (a.toLowerCase() === searchLower) return -1;
            if (b.toLowerCase() === searchLower) return 1;
            
            // Starts with search term next
            const aStartsWith = a.toLowerCase().startsWith(searchLower);
            const bStartsWith = b.toLowerCase().startsWith(searchLower);
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            
            return 0;
        });
}; 