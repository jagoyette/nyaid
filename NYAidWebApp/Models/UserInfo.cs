using System;

namespace NYAidWebApp.Models
{
    public class UserInfo
    {
        public string Id { get; set; }

        public bool IsAuthenticated { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }
    }
}
