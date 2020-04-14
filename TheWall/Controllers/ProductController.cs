using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using TheWall.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TheWall.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductController : Controller
    {
        private MyContext dbContext;
        private IConfiguration _config;

        public ProductController(MyContext context, IConfiguration config)
        {
            dbContext = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        [Route("create/{userid}")]
        public string CreateProduct(Product product, int userid)
        {
            Console.WriteLine("TEST!!!!!!!");
            if (ModelState.IsValid)
            {

                Product newProduct = new Product()
                {
                    Name = product.Name,
                    Quantity = product.Quantity,
                    Description = product.Description,
                    UserId = userid,
                };
                dbContext.Products.Add(newProduct);
                dbContext.SaveChanges();
                User vendor1 = dbContext.Users.FirstOrDefault(u => u.UserId == userid);
                var message = new { message = "Product successfully created" };
                return JsonConvert.SerializeObject(message);
            }
            else
            {
                Console.WriteLine("******* Modelstate is not valid");
                var error = new { Message = "Error", Error = "Modelstate is not valid" };
                return JsonConvert.SerializeObject(error);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("products")]
        public string Index()
        {
            List<Product> allProducts = dbContext.Products.Include(x => x.Vendor).ToList();
            var products = new { Products = allProducts };
            return JsonConvert.SerializeObject(products);
        }
    }
}
