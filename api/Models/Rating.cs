using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Rating
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; } = null!;
    [Range(1, 5)]
    public int Score { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

} 