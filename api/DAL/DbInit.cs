using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.DAL;

public class DbInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        var context = serviceScope.ServiceProvider.GetService<MovieDbContext>();

        // Delete and recreate the database
        context?.Database.EnsureDeleted();
        context?.Database.EnsureCreated();

        if (context != null)
        {
            var movie1 = new Movie
            {
                Title = "Inception",
                Genre = "Sci-Fi",
                ReleaseDate = new DateTime(2010, 7, 16),
                Description = "A thief who steals corporate secrets through dream-sharing technology...",
                ImagePath = "/uploads/inception.png"
            };

            var movie2 = new Movie
            {
                Title = "The Dark Knight",
                Genre = "Action",
                ReleaseDate = new DateTime(2008, 7, 18),
                Description = "When the menace known as the Joker wreaks havoc and chaos on Gotham...",
                ImagePath = "/uploads/dark-knight.png"
            };

            context.Movies.Add(movie1);
            context.Movies.Add(movie2);

            // Add some initial ratings
            context.Ratings.AddRange(
                new Rating { Movie = movie1, Score = 5 },
                new Rating { Movie = movie1, Score = 4 },
                new Rating { Movie = movie2, Score = 5 },
                new Rating { Movie = movie2, Score = 5 }
            );

            context.SaveChanges();
        }
    }
}