namespace api.Models;

public class Movie
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Genre { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string? Description { get; set; }
    public string? ImagePath { get; set; }
    public ICollection<Rating> Ratings { get; set; } = new List<Rating>();

    // Calculate average score from ratings
    public double AverageScore => Ratings.Any() ? Math.Round(Ratings.Average(r => r.Score), 1) : 0;
}
