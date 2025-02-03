using api.Models;

namespace api.ViewModels
{
    public class MoviesViewModel
    {
        public IEnumerable<Movie> Movies;
        public string? CurrentViewName;
    }
}