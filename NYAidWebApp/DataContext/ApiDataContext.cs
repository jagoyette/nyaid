
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
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
                    v => JsonConvert.DeserializeObject<List<Note>>(v))
                // EF Core needs a comparator for the note list as well
                // see https://docs.microsoft.com/en-us/ef/core/modeling/value-comparers
                .Metadata
                .SetValueComparer(new ValueComparer<List<Note>>(
                    (c1, c2) => c1.SequenceEqual(c2),
                    c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                    c => c.ToList()));
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
