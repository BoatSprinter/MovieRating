export const validateMovie = (movie: {
    title: string;
    genre: string;
    description: string;
}) => {
    const errors: string[] = [];

    // Title validation
    if (!movie.title) {
        errors.push('Title is required');
    } else {
        const titleRegex = /^[0-9a-zA-ZæøåÆØÅ. \-]+$/;
        if (!titleRegex.test(movie.title)) {
            errors.push('Title can only contain letters, numbers, spaces, dots, and hyphens');
        }
        if (movie.title.length < 2 || movie.title.length > 100) {
            errors.push('Title must be between 2 and 100 characters');
        }
    }

    // Genre validation
    if (!movie.genre) {
        errors.push('Genre is required');
    } else if (movie.genre.length > 200) {
        errors.push('Genre cannot exceed 200 characters');
    }

    // Description validation
    if (!movie.description) {
        errors.push('Description is required');
    } else if (movie.description.length < 2 || movie.description.length > 1000) {
        errors.push('Description must be between 2 and 1000 characters');
    }

    return errors;
}; 