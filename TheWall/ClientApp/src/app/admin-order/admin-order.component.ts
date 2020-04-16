import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.css']
})
export class AdminOrderComponent implements OnInit {
  id: {};
  userid: number;
  products: {};
  users: {};
  user: {};
  CustomerCart = [];
  newOrder: any;
  productId: number;
  quantity1: number;
  customerId: number;
  vendorId: number;
  shoppingCart: any;
  shoppingcart2 = [];
  orders: any;
  ordersdeserialized = [];
  ParsedOrders = [];



  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this.getUsersFromService();
    this.getProductsFromService();
    this.getOrdersFromService();
    this.currentUser();
    this.newOrder = { UserId: null, Quantity: null, Products: null };
    this.shoppingCart = { cart: null };
  }

  isUserAuthenticated() {
    let token: string = localStorage.getItem("token");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.id = { id: this.jwtHelper.decodeToken(token).nameid };
      this.userid = parseInt(this.jwtHelper.decodeToken(token).nameid, 10);
      console.log("*******!!!!!!!!********!!!!!!!!", this.id);
      console.log("*******!!!!!!!!********!!!!!!!!", this.jwtHelper.decodeToken(token));
      return true;
    } else {
      return false;
    }
  }

  getProductsFromService() {
    let observable = this._httpService.getProducts();
    observable.subscribe(data => {
      this.products = data['Products'];
      console.log("Got our products from service!", this.products);
    })
  }

  logOut() {
    window.localStorage.clear();
    this._route.navigate([""]);
  }

  getUsersFromService() {
    let observable = this._httpService.getUsers();
    observable.subscribe(data => {
      console.log("Got our users!", data);
      this.users = data['Users'];
      console.log(this.users);
    })
  }

  currentUser() {
    let observable = this._httpService.getUser(this.userid);
    observable.subscribe(data => {
      console.log("Got our user!", data);
      this.user = data['User'];
      var array = this.shoppingcart2
      console.log(JSON.parse(data['User']['ShoppingCart']));
      Object.keys(JSON.parse(data['User']['ShoppingCart'])).forEach(function (key) {
        console.log(key + " $-$ " + JSON.parse(data['User']['ShoppingCart'])[key]);
        array.push(JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key]));
        //console.log(key + " &-& " + JSON.parse(data['User']['ShoppingCart'])[key]);


      });
      this.shoppingcart2 = array;
      console.log("*******Test!!!!!!!********", this.shoppingcart2);
    })
  }

  placeOrder() {
    console.log("Check!!!!!!!");
    //this.userid = parseInt(this.jwtHelper.decodeToken(token).nameid, 10);
    this.newOrder['UserId'] = this.customerId;
    this.newOrder['Quantity'] = this.quantity1;
    this.shoppingCart['cart'] = this.customerId;
    this.newOrder['Products'] = JSON.stringify(this.CustomerCart);
    //console.log("******Test*******", this.newOrder);
    this.newOrder['UserId'] = parseInt(this.newOrder['UserId'], 10);
    this.newOrder['Quantity'] = parseInt(this.newOrder['Quantity'], 10);
    console.log(typeof (this.newOrder['Products']));
    console.log(typeof (this.newOrder['Quantity']));
    console.log(typeof (this.newOrder['UserId']));
    console.log("*******NewOrder*******", this.newOrder);
    let observable = this._httpService.createOrder(this.newOrder);
    observable.subscribe(data => {
      console.log("Success!!!!!!!");
      console.log(data);
      this.newOrder = { UserId: null, Quantity: null, Products: null };
    })
  }

  addToCart() {
    let observable = this._httpService.checkInventory(this.productId, this.quantity1, this.userid);
    observable.subscribe(data => {
      console.log(data);
      this._route.navigate(["admin/order"]);
      //this.CustomerCart.push({ productid: this.productId, quantity: this.quantity1, vendorId: data['VendorId'], lastName: data['VendorLastName'], firstName: data['VendorFirstName'], email: data['VendorEmail'] });
      //console.log("****CustomerCartLog********");
      //console.log(this.CustomerCart);
    })
  }

  getOrdersFromService() {
    let observable = this._httpService.getOrders();
    observable.subscribe(data => {
      //console.log("Destringify", data['Orders']['Products']);
      console.log("Orders!!!!!!!", data['Orders']);
      for (var i = 0; i < data['Orders'].length; i++) {
        console.log("Destringify Object's products", JSON.parse(data['Orders'][i]['Products']));
        console.log(data['Orders'][i]);
        var firststep = JSON.parse(data['Orders'][i]['Products']);
        console.log("&&&&&&&&Firstep^^^^^^^^", firststep);
        for (var x = 0; x < JSON.parse(data['Orders'][i]['Products']).length; x++) {
          //console.log("TEEEEEESSTT", JSON.parse(data['Orders'][i]['Products'])[x]);

          this.ordersdeserialized.push(JSON.parse(data['Orders'][i]['Products'])[x]);
        }

        //this.ParsedOrders.push(JSON.parse(firststep['Test']));
        //console.log("object", data['Orders'][i]);

      }
      console.log("UnpackedOrders", this.ordersdeserialized);
      console.log("Testing Parsed Orders Array!", this.ParsedOrders);
      this.orders = data['Orders'];
      console.log("got our pending orders!", this.ordersdeserialized);

    })
  }

  //viewShoppingCart() {
  //  let observable = this._httpService.
  //}

}
