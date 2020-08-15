using System;
using System.ComponentModel.DataAnnotations;
namespace TheWall.Models
{
    public class UpdatedProduct
    {
        [Required]
        [MinLength(3, ErrorMessage = "Product name must be atleast 3 characters long!")]
        public string name { get; set; }

        [Required]
        [Range(1, 100)]
        public int quantity { get; set; }

        [Required]
        [MinLength(4, ErrorMessage = "Product description must be atleast 4 characters long!")]
        public string description { get; set; }

        [Required]
        public string category { get; set; }

        public float price { get; set; }
    }
}
