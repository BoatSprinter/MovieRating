using System.ComponentModel.DataAnnotations;

namespace api.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public string ApprovalStatus { get; set; } = "Pending";
    public bool IsAdmin { get; set; } = false;

    public List<Movie> Movies { get; set; } = new();
} 