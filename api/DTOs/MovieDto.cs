using System.ComponentModel.DataAnnotations;

namespace api.DTOs
{
    public class MovieDto
    {
        public int Id { get; set; }

        [Required]
        [RegularExpression(@"[0-9a-zA-ZæøåÆØÅ. \-]{2,20}", ErrorMessage = "The Title must be numbers or letters and between 2 to 20 characters.")]
        [Display(Name = "Title name")]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Genre { get; set; } = string.Empty;

        public DateTime ReleaseDate { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }

        public double AverageScore {get; set; }
    }
}