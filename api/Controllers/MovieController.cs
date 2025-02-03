using Microsoft.AspNetCore.Mvc;
using api.Models;
using api.DAL;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MoviesController : ControllerBase
{
    private readonly IMovieRepository _movieRepository;

    public MoviesController(IMovieRepository movieRepository)
    {
        _movieRepository = movieRepository;
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

    [HttpPost("addMovie")]
    public async Task<IActionResult> Create(Movie movie)
    {
        await _movieRepository.AddAsync(movie);
        return CreatedAtAction(nameof(GetById), new { id = movie.Id }, movie);
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
}