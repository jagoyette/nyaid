
using System;
using Microsoft.EntityFrameworkCore;
using NYAidWebApp.Models;

namespace NYAidWebApp.DataContext
{
    public class ApiDataContext : DbContext
    {
        public static string DatabaseName = "ApiData";

        public ApiDataContext(DbContextOptions<ApiDataContext> options) : base(options)
        {
        }

        public string CreateUniqueId()
        {
            return Guid.NewGuid().ToString();
        }

        /// <summary>
        /// Collection of requests
        /// </summary>
        public DbSet<Request> Requests { get; set; }

        /// <summary>
        /// Collection of known users
        /// </summary>
        public DbSet<UserInfo> Users { get; set; }

    }
}
