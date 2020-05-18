﻿
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
        
        /// <summary>
        /// Collection of requests
        /// </summary>
        public DbSet<Request> Requests { get; set; }

    }
}