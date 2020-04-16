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
                    var error = new { Message = "Error", Error = "Email already in use!" };
                    return JsonConvert.SerializeObject(error);
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
                //User user2 = dbContext.Users.FirstOrDefault(user3 => user3.Email == user.Email);

                //Dictionary<int, string> CustomerCart = new Dictionary<int, string>();

                //var Cart = user2.ShoppingCart = JsonConvert.SerializeObject(CustomerCart);
                //var Cart1 = new { Cart = CustomerCart };
                //var Cart = JsonConvert.SerializeObject(Cart1);

                //ShoppingCart shoppingCart = new ShoppingCart()
                //{
                //    UserId = user2.UserId,
                //    Items = Cart,
                //};
                //dbContext.Add(shoppingCart);
                //dbContext.SaveChanges();
                var message = new { Response = "Message", Message = "Success!"};

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
            //var userInDB = dbContext.Users.FirstOrDefault(u => u.UserId == userid);
            //var user = new { User = userInDB };
            //return JsonConvert.SerializeObject(user);
            User user = dbContext.Users.FirstOrDefault(ut => ut.UserId == userid);
            var User = new { User = user };
            return JsonConvert.SerializeObject(User);
        }

        [Authorize]
        [HttpPost]
        [Route("update/{userid}")]
        public string Update(UpdatedUser user, int userid)
        {
            Console.WriteLine("*******!!!!!!!!********!!!!!!!!");
            if(ModelState.IsValid)
            {
                PasswordHasher <User> Hasher = new PasswordHasher<User>();
                User userInDB = dbContext.Users.FirstOrDefault(u => u.UserId == userid);
                userInDB.FirstName = user.firstName;
                userInDB.LastName = user.lastName;
                userInDB.Email = user.email;
                userInDB.Password = Hasher.HashPassword(userInDB, user.password);
                dbContext.SaveChanges();
                var message = new { message = "Successfully updated user" };
                return JsonConvert.SerializeObject(message);
            }
            else
            {
                var error = new { error = "Error modelstate is not valid." };
                return JsonConvert.SerializeObject(error);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("delete/{userId}")]
        public string Destroy(int userId)
        {
            User selectedUser = dbContext.Users.FirstOrDefault(u => u.UserId == userId);
            dbContext.Users.Remove(selectedUser);
            dbContext.SaveChanges();
            var notification = new { message = "User successfully deleted!" };
            return JsonConvert.SerializeObject(notification);
        }

        [Authorize]
        [HttpGet]
        [Route("users")]
        public string Index()
        {
            List<User> allUsers = dbContext.Users.ToList();
            var Users = new { Users = allUsers };
            try
            {
                return JsonConvert.SerializeObject(Users);
            }
            catch
            {
                return JsonConvert.SerializeObject(Users, new JsonSerializerSettings()
                {
                    PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                    Formatting = Formatting.Indented,
                });
            }
        }


        //[HttpPost]
        //[Route("product/create/{userid}")]
        //public string CreateProduct(Product product, int userid)
        //{
        //    Console.WriteLine("TEST!!!!!!!");
        //    if (ModelState.IsValid)
        //    {

        //        Product newProduct = new Product()
        //        {
        //            Name = product.Name,
        //            Quantity = product.Quantity,
        //            Description = product.Description,
        //            UserId = userid,
        //        };
        //        dbContext.Products.Add(newProduct);
        //        dbContext.SaveChanges();
        //        User vendor1 = dbContext.Users.FirstOrDefault(u => u.UserId == userid);
        //        var message = new { message = "Product successfully created" };
        //        return JsonConvert.SerializeObject(message);
        //    }
        //    else
        //    {
        //        Console.WriteLine("******* Modelstate is not valid");
        //        var error = new { Message = "Error", Error = "Modelstate is not valid" };
        //        return JsonConvert.SerializeObject(error);
        //    }
        //}
    }
}
