using Microsoft.EntityFrameworkCore;
using api.Models;
using System.Security.Cryptography;
using System.Text;


namespace api.DAL;

public class DbInit
{
    private static string ComputeHash(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        var context = serviceScope.ServiceProvider.GetService<MovieDbContext>();

        // Delete and recreate the database
        context?.Database.EnsureDeleted();
        context?.Database.EnsureCreated();

        if (context != null)
        {
            // Create users
            var user1 = new User { Username = "john@example.com", PasswordHash = ComputeHash("Password123") };
            var user2 = new User { Username = "jane@example.com", PasswordHash = ComputeHash("Password123") };
            var user3 = new User { Username = "bob@example.com", PasswordHash = ComputeHash("Password123") };

            context.Users.AddRange(user1, user2, user3);
            context.SaveChanges();

            // Create movies for different users
            var movies = new[]
            {
                new Movie
                {
                    Title = "Inception",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2010, 7, 16),
                    Description = "A thief who steals corporate secrets through dream-sharing technology...",
                    ImagePath = "/uploads/inception.png",
                    UserId = user1.Id
                },
                new Movie
                {
                    Title = "The Dark Knight",
                    Genre = "Action",
                    ReleaseDate = new DateTime(2008, 7, 18),
                    Description = "When the menace known as the Joker wreaks havoc and chaos on Gotham...",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user1.Id
                },
                new Movie
                {
                    Title = "Pulp Fiction",
                    Genre = "Crime",
                    ReleaseDate = new DateTime(1994, 10, 14),
                    Description = "The lives of two mob hitmen, a boxer, a gangster and his wife...",
                    ImagePath = "/uploads/pulp-fiction.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "The Matrix",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(1999, 3, 31),
                    Description = "A computer programmer discovers that reality as he knows it is a simulation...",
                    ImagePath = "/uploads/matrix.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "Forrest Gump",
                    Genre = "Drama",
                    ReleaseDate = new DateTime(1994, 7, 6),
                    Description = "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal...",
                    ImagePath = "/uploads/forrest-gump.png",
                    UserId = user3.Id
                }
            };

            context.Movies.AddRange(movies);

            // Add some ratings
            var ratings = new[]
            {
                new Rating { Movie = movies[0], Score = 5 },
                new Rating { Movie = movies[0], Score = 4 },
                new Rating { Movie = movies[1], Score = 5 },
                new Rating { Movie = movies[1], Score = 5 },
                new Rating { Movie = movies[2], Score = 4 },
                new Rating { Movie = movies[3], Score = 5 },
                new Rating { Movie = movies[4], Score = 3 }
            };

            context.Ratings.AddRange(ratings);
            context.SaveChanges();

            // Calculate and update statistics for each movie
            foreach (var movie in movies)
            {
                movie.RatingCount = movie.Ratings.Count;
                movie.TotalScore = movie.Ratings.Sum(r => r.Score);
                movie.AverageScore = Math.Round((double)movie.TotalScore / movie.RatingCount, 1);
            }

            context.SaveChanges();
            
        }
    }
}