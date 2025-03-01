using System;

namespace api.Models;

public class Comment
{
    public int Id { get; set; }
    public string Text { get; set; }
    public string AuthorName { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    
    // Foreign key relationship
    public int MovieId { get; set; }
    public Movie Movie { get; set; }
} 