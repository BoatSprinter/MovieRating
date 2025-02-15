using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class Rating
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public int? UserId { get; set; }  // Nullable for anonymous ratings
    public int Score { get; set; }
    public bool IsAnonymous { get; set; } = false;
    public string? DeviceId { get; set; }  // Add this for anonymous ratings

    public Movie Movie { get; set; } = null!;
    public User? User { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
} 