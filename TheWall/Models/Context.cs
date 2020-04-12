using System;
using Microsoft.EntityFrameworkCore;
using TheWall.Models;
namespace TheWall.Models
{
    public class MyContext : DbContext
    {
        public MyContext(DbContextOptions options) : base(options) { }
        public DbSet<User> Users {get; set;}
    }
}
