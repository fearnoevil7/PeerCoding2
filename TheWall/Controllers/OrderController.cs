using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using TheWall.Models;
using Microsoft.AspNetCore.Authorization;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TheWall.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : Controller
    {
        private MyContext dbContext;
        private IConfiguration _config;

        public OrderController(MyContext context, IConfiguration config)
        {
            dbContext = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        [Route("create")]
        public string NewOrder(Order order)
        {
            Console.WriteLine("Customer Id");
            Console.WriteLine(order.UserId);
            Console.WriteLine("Products JSON");
            Console.WriteLine(order.Products);
            Console.WriteLine("Products quantity");
            Console.WriteLine(order.Quantity);
            Console.WriteLine("TEST!!!!!!!");
            if (ModelState.IsValid)
            {
                List<object> Products = new List<object>();
               object products = JsonConvert.DeserializeObject<object>(order.Products);
                Console.WriteLine(products);
                Console.WriteLine("products deserialized", products);
               var proudcts1 = new { Products = order.Products, Test = order.Products };
               var test = JsonConvert.SerializeObject(proudcts1);

                Order newOrder = new Order()
                {
                    UserId = order.UserId,
                    Products = test,
                    Quantity = order.Quantity,
                };
                dbContext.Orders.Add(newOrder);
                dbContext.SaveChanges();
                var message = new { message = "Order successfully placed!" };
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
        [Route("index")]
        public string Index()
        {
            List<Order> allOrders = dbContext.Orders.ToList();
            var Orders1 = new { Orders = allOrders };
            try
            {
                return JsonConvert.SerializeObject(Orders1);
            }
            catch
            {
                return JsonConvert.SerializeObject(Orders1, new JsonSerializerSettings()
                {
                    PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                    Formatting = Formatting.Indented,
                });
            }
        }

        [Authorize]
        [HttpGet]
        [Route("addToCart/{productid}/{quantity}/{userid}")]
        public string Cart(int productid, int quantity, int userid)
        {
            Product product = dbContext.Products.Include(x => x.Vendor).FirstOrDefault(product1 => product1.ProductId == productid);
            if (product.Quantity >= quantity)
            {
                User user = dbContext.Users.FirstOrDefault(qz => qz.UserId == userid);
                if (user.ShoppingCart == null)
                {
                    Random rando = new Random();
                    product.Quantity -= quantity;
                    Dictionary<int, string> CustomerCart = new Dictionary<int, string>();
                    var CartDetails = new { ProductId = product.ProductId, Name = product.Name , Quantity = quantity, VendorEmail = product.Vendor.Email, VendorFirstName = product.Vendor.FirstName, VendorLastName = product.Vendor.LastName, Product = product };
                    //var CartDetails2 = new { Product: product }
                    var SerializedCartDetails = JsonConvert.SerializeObject(CartDetails);
                    CustomerCart.Add(rando.Next(1, 100), SerializedCartDetails);
                    var ticket = new { ProductAddedToCart = "The product: " + product.Name + " successfully added to cart!", ProductId = product.ProductId, OrderQuantity = quantity, ProductInventory = product.Quantity, VendorId = product.Vendor.UserId, VendorEmail = product.Vendor.Email, VendorFirstName = product.Vendor.FirstName, VendorLastName = product.Vendor.LastName };
                    var cart3 = new { Cart = CustomerCart };
                    //var Cart = JsonConvert.SerializeObject(ticket);
                    var Cart = JsonConvert.SerializeObject(CustomerCart);
                    user.ShoppingCart = Cart;
                    dbContext.SaveChanges();
                    var success = new { message = "The product: " + product.Name + " successfully added to cart!", ProductId = product.ProductId, OrderQuantity = quantity, ProductInventory = product.Quantity, VendorId = product.Vendor.UserId, VendorEmail = product.Vendor.Email, VendorFirstName = product.Vendor.FirstName, VendorLastName = product.Vendor.LastName, Cart = CustomerCart };
                    return JsonConvert.SerializeObject(success);
                }
                else
                {
                    Random rando = new Random();
                    product.Quantity -= quantity;
                    var CurrentUserCart = JsonConvert.DeserializeObject<Dictionary<int, string>>(user.ShoppingCart);
                    Console.WriteLine(CurrentUserCart);
                    var CartDetails = new { ProductId = product.ProductId, Name = product.Name, Quantity = quantity, VendorEmail = product.Vendor.Email, VendorFirstName = product.Vendor.FirstName, VendorLastName = product.Vendor.LastName, Product = product };
                    var SerializedCartDetails = JsonConvert.SerializeObject(CartDetails);
                    int newCartItemId = rando.Next(1, 1000);
                    bool duplicateIdCheck = false;
                    foreach (KeyValuePair<int, string> entry in CurrentUserCart)
                    {
                        
                        Console.WriteLine(entry.Key + " $-$ " + JsonConvert.DeserializeObject(entry.Value));
                        Console.WriteLine(JsonConvert.DeserializeObject(entry.Value));
                        if (newCartItemId == entry.Key)
                        {
                            duplicateIdCheck = true;
                        }
                    }
                    if (duplicateIdCheck == true)
                    {
                        var error = new { error = "Duplicate shopping cart item error!" };
                        return JsonConvert.SerializeObject(error);
                    }
                    else
                    {
                        CurrentUserCart.Add(rando.Next(1,1000), SerializedCartDetails);
                        Console.WriteLine("*******CurrentUserCart*******", CurrentUserCart);
                        var Cart1 = JsonConvert.SerializeObject(CurrentUserCart);
                        user.ShoppingCart = Cart1;
                        dbContext.SaveChanges();
                        var success = new { message = "The product: " + product.Name + " successfully added to cart!", ProductId = product.ProductId, OrderQuantity = quantity, ProductInventory = product.Quantity, VendorId = product.Vendor.UserId, VendorEmail = product.Vendor.Email, VendorFirstName = product.Vendor.FirstName, VendorLastName = product.Vendor.LastName, Cart = CurrentUserCart };
                        return JsonConvert.SerializeObject(success);
                    }
                    
                }
            }
            else
            {
               var error = new { error = "Sorry for the inconvenience there are only " + product.Quantity + " available!"};
               return JsonConvert.SerializeObject(error);
            }
        }
    }
}
