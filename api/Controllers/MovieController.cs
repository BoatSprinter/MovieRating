using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.DAL;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movieRepository;
    private readonly IWebHostEnvironment _environment;

    public MoviesController(IMovieRepository movieRepository, IWebHostEnvironment environment)
    {
        _movieRepository = movieRepository;
        _environment = environment;
    }

    [HttpGet("movieList")]
    public async Task<IActionResult> GetAll()
    {
        var movies = await _movieRepository.GetAllAsync();
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



    

    [HttpGet("debug")]
    public ActionResult<IEnumerable<Movie>> GetAllMoviesDebug()
    {
        var movies = _movieRepository.GetAllAsync().Result.ToList();
        return Ok(new
        {
            Count = movies.Count,
            Movies = movies
        });
    }
}