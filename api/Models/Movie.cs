namespace api.Models;

public class Movie
{
    public int Id { get; set; }     //  Primary Key
    public string? Title { get; set; }
    public string? Genre { get; set; }
    public DateTime ReleaseDate { get; set; }
    public string? Description { get; set; }
    public double AverageScore { get; set; }
    public string? ImagePath { get; set; } //Can be null if no image is uploaded


   

    
   

  

    
    

    
}
