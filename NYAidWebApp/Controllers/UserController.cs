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
        private readonly string ClaimsTypeGivenName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
        private readonly string ClaimsTypeSurname = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
        private readonly string ClaimsTypeNameAlt = "name";
        private readonly string ClaimsTypeProviderName = "provider_name";

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

            // Get all claims
            var claims = User.Claims.ToArray();

            // We form a Uid by combining the Provider name with the
            // Providers user id
            var providerName = ExtractUserClaim(claims, ClaimsTypeProviderName);
            var providerId = ExtractUserClaim(claims, ClaimTypeNameIdentifier);
            var uid = $"{providerName}-{providerId}";

            return new UserInfo
            {
                Uid = uid,
                ProviderName = providerName,
                ProviderId = providerId,
                Email = claims.FirstOrDefault(c => c.Type == ClaimTypeEmailAddress)?.Value,
                Name = User.Identity.Name ?? 
                        ExtractUserClaim(claims, ClaimsTypeName) ??
                            ExtractUserClaim(claims, ClaimsTypeNameAlt),
                GivenName = ExtractUserClaim(claims, ClaimsTypeGivenName),
                Surname = ExtractUserClaim(claims, ClaimsTypeSurname)
            };
        }

        /// <summary>
        /// Helper method to extract a claim and return value.
        /// </summary>
        /// <param name="claims">The array of user claims</param>
        /// <param name="claimType">The claim type to extract</param>
        /// <returns>The value of the claim or null if not found</returns>
        private string ExtractUserClaim(Claim[] claims, string claimType)
        {
            return claims.FirstOrDefault(c => c.Type == claimType)?.Value;
        }
    }
}