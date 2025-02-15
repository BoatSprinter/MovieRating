export interface Movie {
    id: number;
    title: string;
    genre: string;
    releaseDate: string;
    description: string;
    averageScore: number;
    imagePath: string; 
    ratingCount: number;
    genres: { id: number; name: string; }[];  // Add this line
}

export interface Rating {
    movieId: number;
    score: number;
  }

  export interface UpdateMovieForm {
    id: number;
    title: string;
    genre: string;
    releaseDate: string;
    description: string;
    image: File | null;
  }

export interface CreateMovieData {
    title: string;
    genre: string;
    releaseDate: string;
    description: string;
    image?: File;
}

export interface UpdateMovieData {
    id: number;
    title: string;
    genre: string;
    releaseDate: string;
    description: string;
    image?: File | null;
}