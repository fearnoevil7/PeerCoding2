using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using TheWall.Models;
using Microsoft.EntityFrameworkCore;

namespace TheWall.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        public string Products { get; set; }
        public int UserId { get; set; }
        public string Ticket { get; set; }
        public string CustomerName { get; set; }
        [ForeignKey("UserId")]
        public User Customer { get; set; }
        //public Dictionary<int, Product> ShoppingCart { get; set; }
    }
}
