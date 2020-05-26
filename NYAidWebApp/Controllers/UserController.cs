using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NYAidWebApp.Models;

namespace NYAidWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string ClaimTypeNameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        private readonly string ClaimTypeEmailAddress = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
        private readonly string ClaimsTypeName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        private readonly string ClaimsTypeNameAlt = "name";

        private readonly ILogger _log;

        public UserController(ILoggerFactory loggerFactory)
        {
            this._log = loggerFactory.CreateLogger<UserController>();
        }

        [HttpGet]
        [Authorize]
        public UserInfo GetUser()
        {
            _log.LogInformation("Retrieving current user info.");

            // This API call requires authentication, so the current user must
            // already be logged in. The Easy Auth middleware will populate
            // User claims.

            // Sanity check for valid user
            if (User == null)
                return null;

            var headers = this.Request.Headers;
            foreach (var header in headers)
            {
                _log.LogInformation($"{header.Key}: {header.Value}");
            }

            // Get all claims
            var claims = User.Claims.ToArray();

            return new UserInfo
            {
                Id = claims.FirstOrDefault(c => c.Type == ClaimTypeNameIdentifier)?.Value,
                Email = claims.FirstOrDefault(c => c.Type == ClaimTypeEmailAddress)?.Value,
                Name = User.Identity.Name ?? 
                       (claims.FirstOrDefault(c => c.Type == ClaimsTypeName || c.Type == ClaimsTypeNameAlt)?.Value)
            };
        }
    }
}