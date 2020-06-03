
using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Serialize Notes as a JSON string for storage in the Offers table
            modelBuilder.Entity<Offer>().Property(p => p.Notes)
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<List<Note>>(v));
        }

        /// <summary>
        /// Collection of requests
        /// </summary>
        public DbSet<Request> Requests { get; set; }

        /// <summary>
        /// Collection of known users
        /// </summary>
        public DbSet<UserInfo> Users { get; set; }

        /// <summary>
        /// Collection of Offers
        /// </summary>
        public DbSet<Offer> Offers { get; set; }

    }
}
