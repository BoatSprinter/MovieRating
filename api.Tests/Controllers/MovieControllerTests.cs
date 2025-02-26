using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;
using api.Controllers;
using api.DAL;
using api.DTOs;
using api.Models;

public class MovieControllerTests
{
    private MovieDbContext GetDbContext()
    {
        var options = new DbContextOptionsBuilder<MovieDbContext>()
            .UseSqlite("Filename=:memory:") // SQLite In-Memory
            .Options;

        var context = new MovieDbContext(options);
        context.Database.OpenConnection(); // Keep connection open for in-memory DB
        context.Database.EnsureCreated();  // Ensure schema is created

        return context;
    }

    private MoviesController GetController(MovieDbContext context)
    {
        var mockRepo = new Mock<IMovieRepository>();
        var mockEnv = new Mock<IWebHostEnvironment>();
        var mockLogger = new Mock<ILogger<MoviesController>>();

        var controller = new MoviesController(mockRepo.Object, mockEnv.Object, context, mockLogger.Object);

        // Mock authenticated user
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "1") // Simulate logged-in user with ID 1
        }, "mock"));

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };

        return controller;
    }

    [Fact]
    public async Task GetMovies_ReturnsAllMovies()
    {
        // Arrange
        using var context = GetDbContext();

        // 🛠 Add a user to satisfy the foreign key constraint
        var user = new User { Id = 1, Username = "testuser", PasswordHash = "hashedpassword" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // 🛠 Now we can add movies with a valid UserId
        context.Movies.Add(new Movie { Title = "Inception", Genre = "Sci-Fi", ReleaseDate = DateTime.Now, UserId = 1 });
        context.Movies.Add(new Movie { Title = "Interstellar", Genre = "Sci-Fi", ReleaseDate = DateTime.Now, UserId = 1 });
        await context.SaveChangesAsync();

        var controller = GetController(context);

        // Act
        var result = await controller.GetMovies();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var movies = Assert.IsType<List<object>>(okResult.Value);
        Assert.Equal(2, movies.Count);
    }

    [Fact]
    public async Task CreateMovie_ReturnsCreatedAtAction()
    {
        // Arrange
        using var context = GetDbContext();
        var controller = GetController(context);

        var movieDto = new MovieDto
        {
            Title = "The Dark Knight",
            Genre = "Action",
            ReleaseDate = DateTime.Now,
            Description = "Batman fights Joker."
        };

        // Act
        var result = await controller.CreateMovie(movieDto);

        // Assert
        Assert.IsAssignableFrom<ObjectResult>(result.Result);
    }


    [Fact]
    public async Task GetMovie_ReturnsNotFound_WhenMovieDoesNotExist()
    {
        // Arrange
        using var context = GetDbContext();
        var controller = GetController(context);

        // Act
        var result = await controller.GetMovie(999);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task DeleteMovie_RemovesMovie_WhenAuthorized()
    {
        // Arrange
        using var context = GetDbContext();

        // 🛠 Ensure the user exists first
        var user = new User { Id = 1, Username = "testuser", PasswordHash = "hashedpassword" };
        context.Users.Add(user);
        await context.SaveChangesAsync();

        // 🛠 Now we can add a movie with a valid UserId
        var movie = new Movie { Id = 1, Title = "Titanic", Genre = "Romance", UserId = 1 };
        context.Movies.Add(movie);
        await context.SaveChangesAsync();

        var controller = GetController(context);

        // Act
        var result = await controller.DeleteMovie(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Movie deleted successfully", okResult.Value);
        Assert.Null(await context.Movies.FindAsync(1)); // Verify deletion
    }

}
