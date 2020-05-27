
using System.Linq;
using System.Security.Claims;
using NYAidWebApp.Models;

namespace NYAidWebApp.Services
{
    public class UserService
    {
        private readonly string ClaimTypeNameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
        private readonly string ClaimTypeEmailAddress = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
        private readonly string ClaimsTypeName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
        private readonly string ClaimsTypeGivenName = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
        private readonly string ClaimsTypeSurname = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
        private readonly string ClaimsTypeNameAlt = "name";
        private readonly string ClaimsTypeProviderName = "provider_name";

        public UserInfo CreateUserInfoFromClaims(ClaimsPrincipal principal)
        {
            // Sanity check for valid user
            if (principal == null)
                return null;

            // Get all claims
            var claims = principal.Claims.ToArray();

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
                Name = principal.Identity.Name ??
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
