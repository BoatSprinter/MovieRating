using Microsoft.EntityFrameworkCore;
using api.Models;
using api.DAL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
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
    DBInit.Seed(app);
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.UseStaticFiles();

app.MapControllers();

app.Run();
