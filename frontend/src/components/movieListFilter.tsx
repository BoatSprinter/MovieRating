import { Movie } from '../interfaces/movie';

export const filterMovies = (
    movies: Movie[], 
    searchTerm: string, 
    yearFilter: string
): Movie[] => {
    if (!searchTerm && !yearFilter) return movies;

    const searchLower = searchTerm.toLowerCase();
    
    console.log('Filtering with:', {
        searchTerm: searchLower,
        yearFilter,
        totalMovies: movies.length
    });

    const filtered = movies.filter(movie => {
        // Year filter
        const matchesYear = yearFilter === '' || 
                           new Date(movie.releaseDate).getFullYear().toString() === yearFilter;
        
        if (!matchesYear) return false;
        
        // If no search term, return year matches
        if (!searchTerm) return true;

        // Search matches
        const titleMatch = movie.title.toLowerCase().includes(searchLower);
        const genreMatch = movie.genre.toLowerCase().includes(searchLower);
        const descMatch = movie.description.toLowerCase().includes(searchLower);

        console.log('Movie:', {
            title: movie.title,
            genre: movie.genre,
            matches: { titleMatch, genreMatch, descMatch }
        });

        return titleMatch || genreMatch || descMatch;
    }).sort((a, b) => {
        if (!searchTerm) return 0;
        
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const aGenre = a.genre.toLowerCase();
        const bGenre = b.genre.toLowerCase();

        // Exact matches first
        if (aGenre === searchLower && bGenre !== searchLower) return -1;
        if (bGenre === searchLower && aGenre !== searchLower) return 1;
        if (aTitle === searchLower && bTitle !== searchLower) return -1;
        if (bTitle === searchLower && aTitle !== searchLower) return 1;

        // Then starts with matches
        if (aGenre.startsWith(searchLower) && !bGenre.startsWith(searchLower)) return -1;
        if (bGenre.startsWith(searchLower) && !aGenre.startsWith(searchLower)) return 1;
        if (aTitle.startsWith(searchLower) && !bTitle.startsWith(searchLower)) return -1;
        if (bTitle.startsWith(searchLower) && !aTitle.startsWith(searchLower)) return 1;

        return 0;
    });

    console.log('Filtered results:', filtered);
    return filtered;
};

export const sortMovies = (movies: Movie[], sortBy: string): Movie[] => {
    return [...movies].sort((a, b) => {
        switch(sortBy) {
            case 'rating-high':
                return (b.averageScore || 0) - (a.averageScore || 0);
            case 'rating-low':
                return (a.averageScore || 0) - (b.averageScore || 0);
            case 'year-new':
                return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
            case 'year-old':
                return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
            default:
                return 0;
        }
    });
}; 