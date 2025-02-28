using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using api.DAL;
using api.DTOs;
using api.Models;
using System.Security.Claims;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly MovieDbContext _context;

    public AdminController(MovieDbContext context)
    {
        _context = context;
    }

    // Admin check helper method
    private bool IsAdmin()
    {
        return User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
    }

    [HttpGet("pending-users")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetPendingUsers()
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var users = await _context.Users
            .Where(u => u.ApprovalStatus == "Pending")
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                ApprovalStatus = u.ApprovalStatus,
                CreatedAt = DateTime.Now // You might want to add a CreatedAt field to User model
            })
            .ToListAsync();

        return users;
    }

    [HttpPost("approve-user/{id}")]
    public async Task<IActionResult> ApproveUser(int id)
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.ApprovalStatus = "Approved";
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpPost("reject-user/{id}")]
    public async Task<IActionResult> RejectUser(int id)
    {
        if (!IsAdmin())
        {
            return Forbid();
        }

        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.ApprovalStatus = "Rejected";
        await _context.SaveChangesAsync();

        return Ok();
    }
} 