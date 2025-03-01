using Microsoft.AspNetCore.Mvc;
using api.DAL;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly MovieDbContext _context;

    public CommentController(MovieDbContext context)
    {
        _context = context;
    }

    [HttpPost("{movieId}")]
    public async Task<IActionResult> AddComment(int movieId, [FromBody] CommentDto commentDto)
    {
        if (string.IsNullOrEmpty(commentDto.Text))
        {
            return BadRequest("Comment text is required");
        }
        
        var movie = await _context.Movies.FindAsync(movieId);
        if (movie == null)
            return NotFound("Movie not found");
            
        var comment = new Comment
        {
            Text = commentDto.Text,
            AuthorName = string.IsNullOrEmpty(commentDto.AuthorName) ? "Anonymous" : commentDto.AuthorName,
            MovieId = movieId,
            CreatedAt = DateTime.Now
        };
        
        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();
        
        return Ok(comment);
    }

    public class CommentDto
    {
        public string Text { get; set; }
        public string AuthorName { get; set; }
    }
} 