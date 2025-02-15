using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace api.DTOs;

public class MovieDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    [RegularExpression(@"^[0-9a-zA-ZæøåÆØÅ. \-]+$", ErrorMessage = "Title can only contain letters, numbers, spaces, dots, and hyphens")]
    [Display(Name = "Title name")]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]  // Increased to accommodate multiple genres
    public string Genre { get; set; } = string.Empty;

    public DateTime ReleaseDate { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 2)]
    [Display(Name = "Description")]
    public string Description { get; set; } = string.Empty;

    public IFormFile? Image { get; set; }
}