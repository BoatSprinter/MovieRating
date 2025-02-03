using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.DAL;

public static class DBInit
{
    public static void Seed(IApplicationBuilder app)
    {
        using var serviceScope = app.ApplicationServices.CreateScope();
        MovieDbContext context = serviceScope.ServiceProvider.GetRequiredService<MovieDbContext>();
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();

        if (!context.Movies.Any())
        {
            var movies = new List<Movie>
            {
                new Movie
                {
                    Title = "Madagascar",
                    Genre = "Family film",
                    ReleaseDate = DateTime.Parse("2005-05-27"),
                    Description = "A group of animals who have spent all their life in a New York zoo end up in the jungles of Madagascar, and must adjust to living in the wild.",
                    AverageScore = 4.6
                },
                new Movie
                {
                    Title = "Shrek",
                    Genre = "Family film",
                    ReleaseDate = DateTime.Parse("2001-04-22"),
                    Description = "An embittered ogre named Shrek finds his home in the swamp overrun by fairy tale creatures banished by the obsessive ruler Lord Farquaad.",
                    AverageScore = 4.4
                }
            };
            context.AddRange(movies);
            context.SaveChanges();
        }
    }
}