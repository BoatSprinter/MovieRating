using Microsoft.EntityFrameworkCore;
using api.Models;

namespace api.DAL;

public class MovieDbContext : DbContext
{
    public MovieDbContext(DbContextOptions<MovieDbContext> options) : base(options) { }

    public DbSet<Movie> Movies { get; set; } = null!;
    public DbSet<Rating> Ratings { get; set; } = null!;
    public DbSet<User> Users => Set<User>();
    public DbSet<Comment> Comments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Rating>()
            .HasOne(r => r.Movie)
            .WithMany(m => m.Ratings)
            .HasForeignKey(r => r.MovieId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Rating>()
            .HasOne(r => r.User)
            .WithMany()
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired(false);  // Allow null for anonymous ratings

        // Add unique constraint for DeviceId + MovieId combination
        modelBuilder.Entity<Rating>()
            .HasIndex(r => new { r.DeviceId, r.MovieId })
            .IsUnique()
            .HasFilter("[DeviceId] IS NOT NULL"); // Only apply uniqueness when DeviceId is not null
    }    
}