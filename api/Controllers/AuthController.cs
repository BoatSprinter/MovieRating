using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.DAL;
using api.DTOs;
using api.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Cryptography;
using System.Text;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly MovieDbContext _context;
    private readonly ILogger<AuthController> _logger;

    public AuthController(MovieDbContext context, ILogger<AuthController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterDto registerDto)
    {
        if (registerDto.Password != registerDto.ConfirmPassword)
        {
            return BadRequest("Passwords do not match");
        }

        if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
        {
            return BadRequest("Username already exists");
        }

        var user = new User
        {
            Username = registerDto.Username,
            PasswordHash = ComputeHash(registerDto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok("Registration successful");
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginDto loginDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null || user.PasswordHash != ComputeHash(loginDto.Password))
        {
            return Unauthorized("Invalid username or password");
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var authProperties = new AuthenticationProperties();

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(claimsIdentity),
            authProperties);

        return Ok("Login successful");
    }

    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok("Logged out successfully");
    }

    [HttpGet("check")]
    public ActionResult CheckAuth()
    {
        if (User.Identity?.IsAuthenticated == true)
        {
            return Ok(new
            {
                isAuthenticated = true,
                username = User.Identity.Name
            });
        }

        return Ok(new
        {
            isAuthenticated = false,
            username = (string?)null
        });
    }

    private string ComputeHash(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }
} 