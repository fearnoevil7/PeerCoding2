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
    public class WeatherForecastController : ControllerBase
    {
        private MyContext dbContext;
        public WeatherForecastController(MyContext context)
        {
            dbContext = context;
        }
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
        [HttpPost]
        [Route("/create")]
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
                if(dbContext.Users.Any(user1 => user1.Email == user.Email))
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
                var message = new {Response = "Message", Message = "Success!"};

                return JsonConvert.SerializeObject(newUser);
            }
            else
            {
                var error = new { Message = "Error", Error = "Model state validation has failed!" };
                return JsonConvert.SerializeObject(error);
            }
        }
    }
}
