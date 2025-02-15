export interface Movie {
    id: number;
    title: string;
    genre: string;
    releaseDate: string;
    description: string;
    averageScore: number;
    imagePath: string; 
    ratingCount: number;
}

export interface Rating {
    movieId: number;
    score: number;
  }