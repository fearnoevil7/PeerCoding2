using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using TheWall.Models;

namespace TheWall.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : Controller
    {
        private MyContext dbContext;

        public HomeController(MyContext context)
        {
            dbContext = context;
        }
        [HttpPost]
        [Route("user/create")]
        public string Create(User user)
        {
            Console.WriteLine(user.FirstName);
            Console.WriteLine(user.LastName);
            Console.WriteLine(user.Email);
            Console.WriteLine("Password");
            Console.WriteLine(user.Password);
            Console.WriteLine("Confirm Password");
            Console.WriteLine(user.ConfirmPassword);
            if (ModelState.IsValid)
            {
                Console.WriteLine("Modelstate has passed validation");
                if (dbContext.Users.Any(user1 => user1.Email == user.Email))
                {
                    ModelState.AddModelError("Email", "Email already in use!");
                }
                PasswordHasher<User> Hasher = new PasswordHasher<User>();
                User newUser = new User()
                {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Password = Hasher.HashPassword(user, user.Password),
                };
                dbContext.Add(newUser);
                dbContext.SaveChanges();
                var message = new { Response = "Message", Message = "Success!" };

                return JsonConvert.SerializeObject(message);
            }
            else
            {
                Console.WriteLine("*******ModelState Validation has failed");
                var error = new { Message = "Error", Error = "Model state validation has failed!" };
                return JsonConvert.SerializeObject(error);
            }
        }
    }
}
