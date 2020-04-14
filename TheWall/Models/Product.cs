using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace TheWall.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required]
        [MinLength(3, ErrorMessage = "Product name must be atleast 3 characters long!")]
        public string Name { get; set; }
        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; }
        [Required]
        [MinLength(4, ErrorMessage = "Description must be atleast 4 characters long!")]
        public string Description { get; set; }
        [Required]
        public int UserId { get; set; }
        public int TicketNumber { get; set; }
        [ForeignKey("UserId")]
        public User Vendor { get; set; }
        //[ForeignKey("OrderNumber")]
        //public Order Ticket { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;
        [NotMapped]
        public string ImageUrl { get; set; }
    }
}
