using System.Security.Claims;
using NYAidWebApp.Models;

namespace NYAidWebApp.Interfaces
{
    public interface IUserService
    {
        UserInfo CreateUserInfoFromClaims(ClaimsPrincipal principal);
    }
}
