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
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TheWall.Models;

namespace TheWall.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeController : Controller
    {
        private MyContext dbContext;
        private IConfiguration _config;

        public HomeController(MyContext context, IConfiguration config)
        {
            dbContext = context;
            _config = config;
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
        
        [HttpPost]
        [Route("session/create")]
        public string SignIn(LoginUser usersubmission)
        {
            Console.WriteLine("*******Login back end!!!!!!!*******");
            if (ModelState.IsValid)
            {
                var userInDB = dbContext.Users.FirstOrDefault(u => u.Email == usersubmission.email);
                if (userInDB == null)
                {
                    ModelState.AddModelError("Email", "Invalid email");
                    Console.WriteLine("******* Email not registered in database");
                    var error = new { Message = "Error", Error = "Sorry, I dont recognize your email!" };
                    return JsonConvert.SerializeObject(error);
                }
                var Hasher = new PasswordHasher<LoginUser>();
                var result = Hasher.VerifyHashedPassword(usersubmission, userInDB.Password, usersubmission.password);
                if (result == 0)
                {
                    ModelState.AddModelError("Password", "Invalid password!");
                    Console.WriteLine("******* Password does not match any passwords in database");
                    var error = new { Message = "Error", Error = "Sorry, the inputed password is invalid!" };
                    return JsonConvert.SerializeObject(error);
                }
                //int id = userInDB.UserId;
                var tokenstring = GenerateJsonWebToken(userInDB);
                var Token = new { Token = tokenstring };
                return JsonConvert.SerializeObject(Token);
            }
            else
            {
                Console.WriteLine("*******ModelState Validation has failed");
                var error = new { Message = "Error", Error = "Model state validation has failed!" };
                return JsonConvert.SerializeObject(error);
            }
        }

        private string GenerateJsonWebToken(User user)
        {
            List<Claim> claims = new List<Claim>

            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
            };

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds,
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);

        }
        [Authorize]
        [HttpGet]
        [Route("user/{userid}")]
        public string Show(int userid)
        {
            var userInDB = dbContext.Users.FirstOrDefault(u => u.UserId == userid);
            var user = new { User = userInDB };
            return JsonConvert.SerializeObject(user);
        }
    }
}
