using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Models;
using api.DAL;
using api.DTOs;  // Add this line

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GenresController : ControllerBase
    {
        private readonly MovieDbContext _context;

        public GenresController(MovieDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Genre>>> GetGenres()
        {
            return await _context.Genres.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Genre>> CreateGenre([FromBody] GenreDto dto)
        {
            var genre = new Genre { Name = dto.Name };
            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();
            return Ok(genre);
        }
    }
} 