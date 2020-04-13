using System.ComponentModel.DataAnnotations;
using System;
namespace TheWall.Models
{
    public class UpdatedUser
    {
        [Required]
        [MinLength(2, ErrorMessage = "First name must be atleast 2 characters!")]
        public string firstName { get; set; }
        [Required]
        [MinLength(2, ErrorMessage = "Last name must be atleast 2 characters!")]
        public string lastName { get; set; }
        [Required]
        [EmailAddress]
        public string email { get; set; }
        [Required]
        public string password { get; set; }
    }
}
