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
using System.Collections;

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
                    ImageUrl = product.ImageUrl,
                    Category = product.Category,
                    AmountSold = 0,
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
            //try
            //{
            //    return JsonConvert.SerializeObject(products);
            //}
            //catch
            //{
            //    return JsonConvert.SerializeObject(products, new JsonSerializerSettings()
            //    {
            //        PreserveReferencesHandling = PreserveReferencesHandling.Objects,
            //        Formatting = Formatting.Indented,
            //    });
            //}
        }

        [HttpGet]
        [Route("products/{category}")]
        public string ProductsByCategory(string category)
        {
            //List<Product> selectedproduct = new List<Product>();
            Console.WriteLine(category);
            

            List<Product> selectedproducts = dbContext.Products.Include(x => x.Vendor).Where(x1 => x1.Category == category).ToList();
            Console.WriteLine(selectedproducts);
            var products = new { Products = selectedproducts };
            return JsonConvert.SerializeObject(products);

            //if(category == ""){
            //    List<Product> selectedproducts = dbContext.Products.Include(x => x.Vendor).Where(x1 => x1.Category == ).ToList();
            //    var products = new { Products = selectedproducts };
            //    return JsonConvert.SerializeObject(products);
            //}
            //if (category == 2)
            //{
            //    List<Product> selectedproducts = dbContext.Products.Include(x => x.Vendor).Where(x1 => x1.Category == "Sports Equipment").ToList();
            //    var products = new { Products = selectedproducts };
            //    return JsonConvert.SerializeObject(products);
            //}
            //if (category == 3)
            //{
            //    List<Product> selectedproducts = dbContext.Products.Include(x => x.Vendor).Where(x1 => x1.Category == "Jewelry").ToList();
            //    var products = new { Products = selectedproducts };
            //    return JsonConvert.SerializeObject(products);
            //}
            //if (category == 4)
            //{
            //    List<Product> selectedproducts = dbContext.Products.Include(x => x.Vendor).Where(x1 => x1.Category == "Clothing").ToList();
            //    var products = new { Products = selectedproducts };
            //    return JsonConvert.SerializeObject(products);
            //}
            //if (category == 5)
            //{
            //    List<Product> selectedproducts = dbContext.Products.Include(x => x.Vendor).Where(x1 => x1.Category == "Musical Instrument").ToList();
            //    var products = new { Products = selectedproducts };
            //    return JsonConvert.SerializeObject(products);
            //}
            //else
            //{
            //    var products = new { errors = "category does not exist!" };
            //    return JsonConvert.SerializeObject(products);
            //}

            //var products = "test";

        }

        [HttpPost]
        [Route("update/{productId}")]
        public string UpdateProduct(UpdatedProduct product, int productId)
        {
            if(ModelState.IsValid)
            {
                Product productSelectedForUpdate = dbContext.Products.Include(x => x.Vendor).FirstOrDefault(u => u.ProductId == productId);
                productSelectedForUpdate.Name = product.name;
                productSelectedForUpdate.Quantity = product.quantity;
                productSelectedForUpdate.Description = product.description;
                productSelectedForUpdate.Category = product.category;
                productSelectedForUpdate.Price = product.price;
                dbContext.SaveChanges();
                var message = new { message = "Product successfully updated!" };
                return JsonConvert.SerializeObject(message);
            }
            else
            {
                var error = new { error = "Error Model State is not valid!" };
                return JsonConvert.SerializeObject(error);
            }
        }
        [HttpGet]
        [Route("show/{productid}")]
        public string show(int productid)
        {
            Product product = dbContext.Products.Include(b => b.Vendor).FirstOrDefault(a => a.ProductId == productid);
            var new_product = new { Product = product };
            return JsonConvert.SerializeObject(new_product);
        }

        [HttpGet]
        [Route("pricerange/{lowestPrice}/{highestPrice}")]
        public string ProductsByPrice(int lowestPrice, int highestPrice)
        {
            List<Product> selectedProducts = dbContext.Products.Include(z => z.Vendor).Where(y => y.Price <= highestPrice && y.Price >= lowestPrice).ToList();
            var products = new { Products = selectedProducts };
            return JsonConvert.SerializeObject(products);
        }

        [HttpGet]
        [Route("quantity/{productId}/{quantity}")]
        public string SellProduct(int productid, int quantity)
        {
            Product selectedProduct = dbContext.Products.Include(w => w.Vendor).FirstOrDefault(m => m.ProductId == productid);
            selectedProduct.AmountSold += quantity;
            dbContext.SaveChanges();
            var message = new { Message = quantity + " items sold!"  };
            return JsonConvert.SerializeObject(message);

        }

        [HttpGet]
        [Route("popularity")]
        public string ByMostSold()
        {
            List<Product> products = dbContext.Products.Include(w => w.Vendor).OrderByDescending(y => y.AmountSold).Take(6).ToList();
            var PackagedProducts = new { Products = products };
            return JsonConvert.SerializeObject(PackagedProducts);

        }
    }
}
