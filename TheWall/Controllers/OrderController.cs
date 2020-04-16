﻿using System;
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
                Random rando = new Random();
                int CartItemId = rando.Next(1, 10000);
                User user = dbContext.Users.FirstOrDefault(qz => qz.UserId == userid);
                if (user.ShoppingCart == null)
                {
                    product.Quantity -= quantity;
                    Dictionary<int, string> CustomerCart = new Dictionary<int, string>();
                    var CartDetails = new { ProductId = product.ProductId, Name = product.Name , Quantity = quantity, VendorEmail = product.Vendor.Email, VendorFirstName = product.Vendor.FirstName, VendorLastName = product.Vendor.LastName, Product = product, CartItemId = CartItemId};
                    //var CartDetails2 = new { Product: product }
                    var SerializedCartDetails = JsonConvert.SerializeObject(CartDetails);
                    CustomerCart.Add(CartItemId, SerializedCartDetails);
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
                    product.Quantity -= quantity;
                    var CurrentUserCart = JsonConvert.DeserializeObject<Dictionary<int, string>>(user.ShoppingCart);
                    Console.WriteLine(CurrentUserCart);
                    var CartDetails = new { ProductId = product.ProductId, Name = product.Name, Quantity = quantity, VendorEmail = product.Vendor.Email, VendorFirstName = product.Vendor.FirstName, VendorLastName = product.Vendor.LastName, Product = product, CartItemId = CartItemId };
                    var SerializedCartDetails = JsonConvert.SerializeObject(CartDetails);
                    //int newCartItemId = rando.Next(1, 10000);

                    bool duplicateIdCheck = false;
                    List<object> test16 = new List<object>();
                    foreach (KeyValuePair<int, string> entry in CurrentUserCart)
                    {
                        Console.WriteLine(entry.Key + " $-$ " + JsonConvert.DeserializeObject(entry.Value));
                        //var test7 = JsonConvert.DeserializeObject(entry.Value);
                        //Console.WriteLine(" %-% " + test7["CartItemId"]);
                        Console.WriteLine(JsonConvert.DeserializeObject(entry.Value));
                        if (CartItemId == entry.Key)
                        {
                            duplicateIdCheck = true;
                        }
                        //test16.Add(JsonConvert.DeserializeObject(entry.Value));
                    }
                    if (duplicateIdCheck == true )
                    {
                        var error = new { error = "Duplicate shopping cart item error!" };
                        return JsonConvert.SerializeObject(error);
                    }
                    else
                    {
                        CurrentUserCart.Add(CartItemId, SerializedCartDetails);
                        Console.WriteLine("*******CurrentUserCart*******", CurrentUserCart);
                        var Cart1 = JsonConvert.SerializeObject(CurrentUserCart);
                        user.ShoppingCart = Cart1;
                        dbContext.SaveChanges();
                        var success = new { message = "The product: " + product.Name + " successfully added to cart!", ProductId = product.ProductId, OrderQuantity = quantity, ProductInventory = product.Quantity, VendorId = product.Vendor.UserId, VendorEmail = product.Vendor.Email, VendorFirstName = product.Vendor.FirstName, VendorLastName = product.Vendor.LastName, Cart = CurrentUserCart, Test16 = test16 };
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

        [Authorize]
        [HttpGet]
        [Route("editCart/{userid}/{keynum}")]
        public string ConfigureCart(int keynum, int userid)
        {
            Dictionary<int, string> newCustomerCart = new Dictionary<int, string>();
            User user1 = dbContext.Users.FirstOrDefault(u => u.UserId == userid);
            Console.WriteLine(JsonConvert.DeserializeObject(user1.ShoppingCart));
            Console.WriteLine("*********SelectedKey*********");
            Console.WriteLine(keynum);
            foreach (KeyValuePair<int, string> entry in JsonConvert.DeserializeObject<Dictionary<int, string>>(user1.ShoppingCart))
            {
                Console.WriteLine(entry.Key + " @$-$@ " + JsonConvert.DeserializeObject(entry.Value));
                if (entry.Key != keynum)
                {
                    Console.WriteLine("^^^^^^^Does Not Match Key num^^^^^^^");
                    Console.WriteLine(entry.Key);
                    newCustomerCart.Add(entry.Key, entry.Value);
                }
            }
            string Cart = JsonConvert.SerializeObject(newCustomerCart);
            user1.ShoppingCart = Cart;
            dbContext.SaveChanges();
            var success = new { Test = newCustomerCart };
            return JsonConvert.SerializeObject(success);
        }
    }
}
