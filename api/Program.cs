using Microsoft.EntityFrameworkCore;
using api.Models;
using api.DAL;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// fjern etter husskkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk
builder.Logging.ClearProviders();
builder.Logging.AddConsole();  // This ensures logs go to console
builder.Logging.AddDebug();    // This ensures logs go to debug output

// Add services to the container sjekk om man trenger de jason stuffene på controller fortsatt.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });
});
builder.Services.AddScoped<IMovieRepository, MovieRepository>();

// Add DbContext
builder.Services.AddDbContext<MovieDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// pic test lets see if this works fix comment after-----
if (!Directory.Exists(Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads")))
{
    Directory.CreateDirectory(Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads"));
}

var app = builder.Build();



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    DbInit.Seed(app);
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();
