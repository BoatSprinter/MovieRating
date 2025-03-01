namespace api.Models;

public class Movie
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? ImagePath { get; set; }
    public int UserId { get; set; }
    
    // New properties for rating statistics
    public int RatingCount { get; set; } = 0;
    public int TotalScore { get; set; } = 0;
    public double AverageScore { get; set; } = 0;

    public User User { get; set; } = null!;
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
