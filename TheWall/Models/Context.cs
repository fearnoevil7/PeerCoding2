using System;
using Microsoft.EntityFrameworkCore;
using TheWall.Models;
namespace TheWall.Models
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions options) : base(options) { }
        public DbSet<User> Users {get; set;}
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasKey(k => k.UserId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer);


            modelBuilder.Entity<Product>()
                .HasOne(j => j.Vendor);
        }
    }

}
