using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.DAL;

public class MovieDbContext : DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) { }

    public DbSet<Movie> Movies { get; set; } = null!;
}