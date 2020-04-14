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
        public int OrderNumber { get; set; }
        [Required]
        [Range(1, 1000000)]
        public int Quantity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User Customer { get; set; }
        //public List<Product> ListOfProducts { get; set; }
    }
}
