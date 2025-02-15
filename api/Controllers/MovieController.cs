using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.DAL;
using api.ViewModels;
using System.Security.Claims;
using api.DTOs;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movieRepository;
    private readonly IWebHostEnvironment _environment;
    private readonly MovieDbContext _context;
    private readonly ILogger<MoviesController> _logger;

    public MoviesController(
        IMovieRepository movieRepository,
        IWebHostEnvironment environment,
        MovieDbContext context,
        ILogger<MoviesController> logger)
    {
        _movieRepository = movieRepository;
        _environment = environment;
        _context = context;
        _logger = logger;
    }

 


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
    {
       var movies = await _context.Movies
           .Include(m => m.Ratings)
           .Select(m => new
           {
               m.Id,
               m.Title,
               m.Genre,
               m.ReleaseDate,
               m.Description,
               m.ImagePath,
               m.AverageScore,
               m.RatingCount
           })
           .ToListAsync();
            
       return Ok(movies);
   }

    [HttpGet("movieId")]
    public async Task<IActionResult> GetById(int id)
    {
        var movie = await _movieRepository.GetByIdAsync(id);
        if (movie == null) return NotFound();
        return Ok(movie);
    }
    
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Movie>> CreateMovie([FromForm] MovieDto movieDto)
    {
        try
        {
            // Log the raw form data
            _logger.LogInformation("Raw form data received in CreateMovie");
            foreach (var key in Request.Form.Keys)
            {
                _logger.LogInformation($"Form key: {key}, Value: {Request.Form[key]}");
            }

            // Log the DTO data
            _logger.LogInformation($"MovieDto data: " +
                $"Title='{movieDto.Title}', " +
                $"Genre='{movieDto.Genre}', " +
                $"ReleaseDate='{movieDto.ReleaseDate}', " +
                $"Description='{movieDto.Description}', " +
                $"HasImage={movieDto.Image != null}");

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            _logger.LogInformation($"Creating movie for userId: {userId}");

            var movie = new Movie
            {
                Title = movieDto.Title,
                Genre = movieDto.Genre,
                ReleaseDate = movieDto.ReleaseDate != default ? movieDto.ReleaseDate : DateTime.Now,
                Description = movieDto.Description ?? string.Empty,
                UserId = userId
            };

            // Log the movie object before saving
            _logger.LogInformation($"Movie object before save: " +
                $"Title='{movie.Title}', " +
                $"Genre='{movie.Genre}', " +
                $"ReleaseDate='{movie.ReleaseDate}', " +
                $"Description='{movie.Description}', " +
                $"UserId={movie.UserId}");

            if (movieDto.Image != null)
            {
                _logger.LogInformation($"Processing image: {movieDto.Image.FileName}, Size: {movieDto.Image.Length} bytes");
                var uploadsDir = Path.Combine(_environment.WebRootPath, "uploads");
                Directory.CreateDirectory(uploadsDir);

                // Generate unique filename
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(movieDto.Image.FileName);
                var filePath = Path.Combine(uploadsDir, fileName);

                // Save file
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await movieDto.Image.CopyToAsync(fileStream);
                }

                // Save path to database
                movie.ImagePath = "/uploads/" + fileName;
                _logger.LogInformation($"Image saved: {movie.ImagePath}");
            }

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Movie created successfully: Id={movie.Id}");

            return CreatedAtAction(nameof(GetMovie), new { id = movie.Id }, movie);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in CreateMovie");
            return StatusCode(500, new { message = $"An error occurred while creating the movie: {ex.Message}" });
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Movie>> GetMovie(int id)
    {
        var movie = await _context.Movies.FindAsync(id);
        if (movie == null)
        {
            return NotFound();
        }
        return movie;
    }

  [HttpPut("updateMovie")]
    [Authorize]
    public async Task<IActionResult> UpdateMovie([FromForm] MovieDto movieDto, int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var movie = await _context.Movies
                .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

            if (movie == null)
            {
                return NotFound("Movie not found or you don't have permission to update it");
            }

            movie.Title = movieDto.Title;
            movie.Genre = movieDto.Genre;
            movie.ReleaseDate = movieDto.ReleaseDate;
            movie.Description = movieDto.Description ?? string.Empty;

            if (movieDto.Image != null)
            {
                var uploadsDir = Path.Combine(_environment.WebRootPath, "uploads");
                Directory.CreateDirectory(uploadsDir);

                // Delete old image if exists
                if (!string.IsNullOrEmpty(movie.ImagePath))
                {
                    var oldFilePath = Path.Combine(_environment.WebRootPath, movie.ImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldFilePath))
                    {
                        System.IO.File.Delete(oldFilePath);
                    }
                }

                // Save new image
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(movieDto.Image.FileName);
                var filePath = Path.Combine(uploadsDir, fileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await movieDto.Image.CopyToAsync(fileStream);
                }
                movie.ImagePath = "/uploads/" + fileName;
            }

            await _context.SaveChangesAsync();
            return Ok("Movie updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating movie");
            return StatusCode(500, new { message = "Error updating movie" });
        }
    }

    [HttpDelete("deleteMovie")]
    [Authorize]
    public async Task<IActionResult> DeleteMovie(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            var movie = await _context.Movies
                .FirstOrDefaultAsync(m => m.Id == id && m.UserId == userId);

            if (movie == null)
            {
                return NotFound("Movie not found or you don't have permission to delete it");
            }

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return Ok("Movie deleted successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting movie");
            return StatusCode(500, new { message = "Error deleting movie" });
        }
    }

    [Authorize]
    [HttpGet("user")]
    public async Task<ActionResult<IEnumerable<Movie>>> GetUserMovies()
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
            
            var userMovies = await _context.Movies
                .Include(m => m.Ratings)
                .Where(m => m.UserId == userId)
                .Select(m => new
                {
                    m.Id,
                    m.Title,
                    m.Genre,
                    m.ReleaseDate,
                    m.Description,
                    m.ImagePath,
                    m.AverageScore
                })
                .OrderByDescending(m => m.Id)
                .ToListAsync();

            return Ok(userMovies);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user movies");
            return StatusCode(500, new { message = "Error fetching movies" });
        }
    }

    [HttpPost("{id}/rate")]
    public async Task<IActionResult> RateMovie(int id, [FromBody] RatingDto ratingDto)
    {
        try 
        {
            var movie = await _context.Movies
                .Include(m => m.Ratings)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
            {
                return NotFound("Movie not found");
            }

            int oldScore = 0;
            bool isNewRating = true;

            if (User.Identity?.IsAuthenticated == true)
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
                var existingRating = movie.Ratings.FirstOrDefault(r => r.UserId == userId);

                if (existingRating != null)
                {
                    oldScore = existingRating.Score;
                    existingRating.Score = ratingDto.Score;
                    isNewRating = false;
                }
                else
                {
                    movie.Ratings.Add(new Rating
                    {
                        MovieId = id,
                        UserId = userId,
                        Score = ratingDto.Score
                    });
                }
            }
            else
            {
                // Get or create device ID
                string deviceId;
                if (!Request.Cookies.TryGetValue("device_id", out deviceId!))
                {
                    deviceId = Guid.NewGuid().ToString();
                    var cookieOptions = new CookieOptions
                    {
                        Expires = DateTime.Now.AddYears(1),
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Strict
                    };
                    Response.Cookies.Append("device_id", deviceId, cookieOptions);
                }

                // Check if device has already rated this movie
                var existingRating = await _context.Ratings
                    .FirstOrDefaultAsync(r => r.DeviceId == deviceId && r.MovieId == id);

                if (existingRating != null)
                {
                    oldScore = existingRating.Score;
                    existingRating.Score = ratingDto.Score;
                    isNewRating = false;
                }
                else
                {
                    // Add new rating
                    movie.Ratings.Add(new Rating
                    {
                        MovieId = id,
                        Score = ratingDto.Score,
                        IsAnonymous = true,
                        DeviceId = deviceId
                    });
                }
            }

            // Update movie statistics
            if (isNewRating)
            {
                movie.RatingCount++;
                movie.TotalScore += ratingDto.Score;
            }
            else
            {
                movie.TotalScore = movie.TotalScore - oldScore + ratingDto.Score;
            }
            
            movie.AverageScore = Math.Round((double)movie.TotalScore / movie.RatingCount, 1);

            await _context.SaveChangesAsync();
            return Ok("Rating updated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating rating");
            return StatusCode(500, "An error occurred while updating the rating");
        }
    }






    //debug endpont fjern detter etter på 

    [HttpGet("debug")]
    public async Task<ActionResult<object>> GetDebugInfo()
    {
        // Get all movies with their ratings
        var movies = await _context.Movies
            .Include(m => m.Ratings)
            .Select(m => new
            {
                m.Id,
                m.Title,
                m.Genre,
                m.ReleaseDate,
                m.Description,
                m.ImagePath,
                Ratings = m.Ratings.Select(r => new
                {
                    r.Id,
                    r.MovieId,
                    r.Score,
                    r.CreatedAt
                }).ToList(),
                AverageScore = m.Ratings.Any() ? Math.Round(m.Ratings.Average(r => r.Score), 1) : 0
            })
            .ToListAsync();


        return Ok(new
        {
        
            Movies = movies,
            //Ratings = allRatings
        });

    }
}