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
            // Create an admin user with a hashed password
            var adminExists = context.Users.Any(u => u.Username == "admin");
            if (!adminExists)
            {
                var adminUser = new User
                {
                    Username = "admin",
                    PasswordHash = ComputeHash("admin"), // Hash the password
                    IsAdmin = true,
                    ApprovalStatus = "Approved" // Admin is auto-approved
                };
                context.Users.Add(adminUser);
                context.SaveChanges();
            }

            // Then create your regular users as normal, but mark them as pending
            var user1 = new User { Username = "t1", PasswordHash = "t1"};
            var user2 = new User { Username = "jane@example.com", PasswordHash = "Password123" };
            var user3 = new User { Username = "bob@example.com", PasswordHash = "Password123" };

            context.Users.AddRange(user1, user2, user3);
            context.SaveChanges();

            // Create movies for different users
            var movies = new List<Movie>
            {
                // Original movies
                new Movie
                {
                    Title = "Inception",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2010, 7, 16),
                    Description = "A thief who steals corporate secrets through dream-sharing technology...",
                    ImagePath = "/uploads/inception.png",
                    UserId = 1
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
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "The Matrix",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(1999, 3, 31),
                    Description = "A computer programmer discovers that reality as he knows it is a simulation...",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "Forrest Gump",
                    Genre = "Drama",
                    ReleaseDate = new DateTime(1994, 7, 6),
                    Description = "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal...",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user3.Id
                }
            };

            // Add 15 more sci-fi movies
            var scifiMovies = new List<Movie>
            {
                new Movie
                {
                    Title = "Blade Runner 2049",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2017, 10, 6),
                    Description = "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user1.Id
                },
                new Movie
                {
                    Title = "Interstellar",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2014, 11, 7),
                    Description = "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "Arrival",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2016, 11, 11),
                    Description = "A linguist is recruited by the military to communicate with alien lifeforms after twelve mysterious spacecraft appear.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user3.Id
                },
                new Movie
                {
                    Title = "Dune",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2021, 10, 22),
                    Description = "Feature adaptation of Frank Herbert's science fiction novel about the son of a noble family.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user1.Id
                },
                new Movie
                {
                    Title = "Ex Machina",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2015, 4, 24),
                    Description = "A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "The Martian",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2015, 10, 2),
                    Description = "An astronaut becomes stranded on Mars after his team assume him dead.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user3.Id
                },
                new Movie
                {
                    Title = "Edge of Tomorrow",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2014, 6, 6),
                    Description = "A soldier fighting aliens gets to relive the same day over and over again.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user1.Id
                },
                new Movie
                {
                    Title = "Annihilation",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2018, 2, 23),
                    Description = "A biologist signs up for a dangerous, secret expedition into a mysterious zone where the laws of nature don't apply.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "Looper",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2012, 9, 28),
                    Description = "In 2074, when the mob wants to get rid of someone, the target is sent into the past, where a hired gun awaits.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user3.Id
                },
                new Movie
                {
                    Title = "Tenet",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2020, 9, 3),
                    Description = "Armed with only one word, Tenet, and fighting for the survival of the entire world.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user1.Id
                },
                new Movie
                {
                    Title = "Gravity",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2013, 10, 4),
                    Description = "Two astronauts work together to survive after an accident leaves them stranded in space.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "District 9",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2009, 8, 14),
                    Description = "Violence ensues after an extraterrestrial race forced to live in slum-like conditions on Earth.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user3.Id
                },
                new Movie
                {
                    Title = "Her",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2013, 12, 18),
                    Description = "In a near future, a lonely writer develops an unlikely relationship with an operating system.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user1.Id
                },
                new Movie
                {
                    Title = "Children of Men",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(2006, 12, 25),
                    Description = "In 2027, in a chaotic world in which women have become somehow infertile.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user2.Id
                },
                new Movie
                {
                    Title = "Blade Runner",
                    Genre = "Sci-Fi",
                    ReleaseDate = new DateTime(1982, 6, 25),
                    Description = "A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth.",
                    ImagePath = "/uploads/dark-knight.png",
                    UserId = user3.Id
                }
            };

            // Add sci-fi movies to the main list
            movies.AddRange(scifiMovies);
            
            // Add all movies to the database
            context.Movies.AddRange(movies);
            context.SaveChanges();

            // Create a list to hold all ratings
            var ratings = new List<Rating>();
            
            // Add ratings for original movies
            ratings.AddRange(new[]
            {
                new Rating { Movie = movies[0], Score = 5 },
                new Rating { Movie = movies[0], Score = 4 },
                new Rating { Movie = movies[1], Score = 5 },
                new Rating { Movie = movies[1], Score = 5 },
                new Rating { Movie = movies[2], Score = 4 },
                new Rating { Movie = movies[3], Score = 5 },
                new Rating { Movie = movies[4], Score = 3 }
            });

            // Add ratings for sci-fi movies (2 ratings per movie)
            for (int i = 5; i < movies.Count; i++)
            {
                // Generate random scores between 3 and 5
                var score1 = new Random().Next(3, 6);
                var score2 = new Random().Next(3, 6);
                
                ratings.Add(new Rating { Movie = movies[i], Score = score1 });
                ratings.Add(new Rating { Movie = movies[i], Score = score2 });
            }

            context.Ratings.AddRange(ratings);
            context.SaveChanges();

            // Calculate and update statistics for each movie
            foreach (var movie in movies)
            {
                movie.RatingCount = movie.Ratings.Count;
                movie.TotalScore = movie.Ratings.Sum(r => r.Score);
                
                // Prevent division by zero
                if (movie.RatingCount > 0)
                {
                    movie.AverageScore = Math.Round((double)movie.TotalScore / movie.RatingCount, 1);
                }
                else
                {
                    movie.AverageScore = 0; // Default value when no ratings
                }
            }

            context.SaveChanges();
        }
    }
}