﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NYAidWebApp.DataContext;
using NYAidWebApp.Models;
using NYAidWebApp.Services;

namespace NYAidWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger _log;
        private readonly ApiDataContext _context;
        private readonly UserService _userService;

        public UserController(ILoggerFactory loggerFactory, ApiDataContext apiDataContext, UserService userService)
        {
            _log = loggerFactory.CreateLogger<UserController>();
            _context = apiDataContext;
            _userService = userService;
        }

        [HttpGet]
        [Authorize]
        public async Task<UserInfo> GetCurrentUser()
        {
            _log.LogInformation("Retrieving current user info.");

            // This API call requires authentication, so the current user must
            // already be logged in. The Easy Auth middleware will populate
            // User claims.

            // Create a UserInfo from the current user claims
            var user = _userService.CreateUserInfoFromClaims(User);

            // Sanity check for valid user
            if (user == null)
                return null;

            // Check if the user exists in our Db and add if needed
            var dbUser = await _context.Users.FirstOrDefaultAsync(u => u.Uid == user.Uid);
            if (dbUser == null)
            {
                _log.LogInformation($"Adding user {user.Name} to database.");
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }

            return user;
        }

        [HttpGet]
        [Authorize]
        [Route("all")]
        public async Task<UserInfo[]> GetAllKnownUsers()
        {
            return await _context.Users.ToArrayAsync();
        }
    }
}