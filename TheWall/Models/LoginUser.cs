using System;
using System.ComponentModel.DataAnnotations;

namespace TheWall.Models
{
    public class LoginUser
    {
        [Required]
        [EmailAddress]
        public string email { get; set; }
        [Required]
        public string password { get; set; }
    }
}
