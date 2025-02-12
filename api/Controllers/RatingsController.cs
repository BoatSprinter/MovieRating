using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.DAL;
using Microsoft.Extensions.Logging;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RatingsController : ControllerBase
{
    private readonly MovieDbContext _context;
    private readonly ILogger<RatingsController> _logger;

    public RatingsController(MovieDbContext context, ILogger<RatingsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<Rating>> AddRating([FromBody] RatingDto ratingDto)
    {
        _logger.LogInformation($"Received rating: MovieId={ratingDto.MovieId}, Score={ratingDto.Score}");

        try
        {
            var movie = await _context.Movies.FindAsync(ratingDto.MovieId);
            if (movie == null)
            {
                return NotFound($"Movie with ID {ratingDto.MovieId} not found");
            }

            var rating = new Rating
            {
                MovieId = ratingDto.MovieId,
                Score = ratingDto.Score,
                CreatedAt = DateTime.UtcNow
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            return Ok(rating);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error adding rating: {ex.Message}");
            return BadRequest($"Failed to add rating: {ex.Message}");
        }
    }
}

public class RatingDto
{
    public int MovieId { get; set; }
    public int Score { get; set; }
} 