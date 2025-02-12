using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Models;
using api.DAL;
using api.ViewModels;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movieRepository;
    private readonly IWebHostEnvironment _environment;
    private readonly MovieDbContext _context;

    public MoviesController(IMovieRepository movieRepository, IWebHostEnvironment environment, MovieDbContext context)
    {
        _movieRepository = movieRepository;
        _environment = environment;
        _context = context;
    }

    /* [HttpGet("movieList")]
    public async Task<IActionResult> GetAll()
    {
        var movies = await _movieRepository.GetAllAsync();
        return Ok(movies);
    } */


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
               m.AverageScore
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

    [HttpPost]
    public async Task<ActionResult<Movie>> PostMovie([FromForm] Movie movie, IFormFile? image)
    {
        if (image != null && image.Length > 0)
        {
            var uploadsFolder = Path.Combine("wwwroot", "uploads");
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            Directory.CreateDirectory(uploadsFolder);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            // Make sure the path starts with a forward slash
            movie.ImagePath = "/uploads/" + uniqueFileName;
        }

        try 
        {
            await _movieRepository.AddAsync(movie);
            return CreatedAtAction(nameof(GetById), new { id = movie.Id }, movie);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("updateMovie")]
    public async Task<IActionResult> Update(int id, Movie movie)
    {
        if (id != movie.Id) return BadRequest();
        await _movieRepository.UpdateAsync(movie);
        return NoContent();
    }

    [HttpDelete("deleteMovie")]
    public async Task<IActionResult> Delete(int id)
    {
        await _movieRepository.DeleteAsync(id);
        return NoContent();
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

/*     // Get all ratings separately
    var allRatings = await _context.Ratings
        .OrderBy(r => r.MovieId)
        .Select(r => new
        {
            r.Id,
            r.MovieId,
            MovieTitle = r.Movie.Title,  // Include the movie title for reference
            r.Score,
            r.CreatedAt
        })
        .ToListAsync(); */

    return Ok(new
    {
      
        Movies = movies,
        //Ratings = allRatings
    });
}
}