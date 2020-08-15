import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  id: {};
  userid: number;
  products: {};
  users: {};
  user: {};
  shoppingcart = [];
  indexId: any;
  tackcart = [];
  CustomerCart: {};
  newOrder: any;
  chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%&";
  randomString = "";
  subTotal = 0;
  tax: number;
  total: number;
  myCart: any;
  DoIIncrementOrNah: string;
  cartItemToUpdate: {};

  rePackagedCart = {};

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
    this.currentUser();
    this.newOrder = { UserId: null, Products: null, Ticket: null };
    this.cartItemToUpdate = { cart: null };
    
    console.log("Final Test!!!!!", JSON.parse(window.localStorage.getItem('UpdateCartTest123')));
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
      var array = this.shoppingcart
      var array2 = this.tackcart;
      var mySubTotal = 0;
      if (data['User']['ShoppingCart'] != null) {
        console.log(JSON.parse(data['User']['ShoppingCart']));
        Object.keys(JSON.parse(data['User']['ShoppingCart'])).forEach(function (key) {
          console.log(JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key])['Price']);
          console.log(JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key])['Quantity']);
          mySubTotal = mySubTotal + (JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key])['Price'] * JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key])['Quantity']);
          console.log(key + " $-$ " + JSON.parse(data['User']['ShoppingCart'])[key]);
          array.push(JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key]));
          array2.push({ key: key, value: JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key]) })
          //console.log(key + " &-& " + JSON.parse(data['User']['ShoppingCart'])[key]);
        });
        this.subTotal = mySubTotal;
        this.tax = Math.round((this.subTotal - (this.subTotal / 1.06)) * 100 ) / 100;
        this.total = Math.round((this.subTotal + this.tax) * 100) / 100;
      }
      this.shoppingcart = array;
      this.tackcart = array2;
      console.log("*******Test!!!!!!!********", this.shoppingcart);
      console.log("!!!!!!*******Test2*******", this.tackcart);

    })
  }

  placeOrder() {


    for (var q = 0; q < Math.floor(Math.random() * 16) + 7; q++) {
      this.randomString += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
    }



    this.newOrder['Ticket'] = this.randomString;
    this.newOrder['UserId'] = this.userid;
    this.newOrder['Products'] = JSON.stringify(this.shoppingcart);
    var shoppingCart = JSON.parse(`{"ShoppingCart" : ${this.newOrder['Products']}}`);
    console.log("*******ParseTestOrder*******", shoppingCart);
    console.log("*******NewOrder*******", this.newOrder);
    console.log(this.shoppingcart);
    for (var x = 0; x < this.shoppingcart.length; x++) {
      console.log(this.shoppingcart[x]);
      console.log("Product Id " + this.shoppingcart[x]['ProductId']);
      console.log("Quantity " + this.shoppingcart[x]['Quantity']);
      this.packageItems(this.shoppingcart[x]['ProductId'], this.shoppingcart[x]['Quantity']);
    }
    let observable = this._httpService.createOrder(this.newOrder);
    observable.subscribe(data => {
      console.log("Success!!!!!!!");
      console.log(data);
      this.newOrder = { UserId: null, Quantity: null, Products: null };
      this._route.navigate(["checkout"]);
    })
  }

  removeFromCart(CartItemId, productid, productquantity) {
    console.log("RemoveCart Index Test!!!!!!!", CartItemId);
    console.log("RemoveCart Index Test!!!!!!!", this.indexId);
    //var SelectedKey = null;
    //for (var x = 0; x < this.tackcart.length; x++) {
    //  console.log("Other Test!", this.tackcart[x]);

    //  if (x == num) {
    //    SelectedKey = this.tackcart[x]['key'];
    //    console.log("RemoveCart Test!!!!!!!", SelectedKey);
    //  }
    //}
    let observable = this._httpService.DeleteItemFromCart(CartItemId, this.userid, productid, productquantity);
    observable.subscribe(data => {
      console.log(data);
      window.localStorage.setItem("admin-order-killswitch", 'false');
      location.reload();
      //this._route.navigate(["/checkout"]);
      //Object.keys(data).forEach(function (key) {
      //  console.log(key + " !$-$! " + data[key]);
      //});

    })
  }

  packageItems(productid: number, quantity: number) {
    let observable = this._httpService.shipItems(productid, quantity);
    observable.subscribe(data => {
      console.log(data);
    })
  }

  DecrementCartItem(key, productid) {
    for (var x = 0; x < this.shoppingcart.length; x++) {
      if (this.shoppingcart[x]['CartItemId'] == key) {
        console.log("Cart Item To Be Updated", this.shoppingcart[x]);
        console.log("Test Result VAlid: " + this.shoppingcart[x]['Quantity']);
        this.shoppingcart[x]['Quantity'] -= 1;
        console.log("Cart Item Updated!!!!!!!", this.shoppingcart[x]);
        this.rePackagedCart['' + this.shoppingcart[x]['CartItemId']] = JSON.stringify(this.shoppingcart[x]);
      }
      else {
        this.rePackagedCart['' + this.shoppingcart[x]['CartItemId']] = JSON.stringify(this.shoppingcart[x]);
      }
    }

    console.log("%%%%%%%%%%TESTTEST$$$$$$$$$$$", this.rePackagedCart);

    this.cartItemToUpdate['cart'] = JSON.stringify(this.rePackagedCart);

    let observable = this._httpService.EditItemFromCart(key, this.userid, productid, true, this.cartItemToUpdate);
    observable.subscribe(data => {
      console.log(data);
      window.localStorage.setItem('UpdateCartTest', JSON.stringify(data));
    });

  }

  IncrementCartItem(key, productid) {
    for (var x = 0; x < this.shoppingcart.length; x++) {
      if (this.shoppingcart[x]['CartItemId'] == key) {
        console.log("Cart Item To Be Updated", this.shoppingcart[x]);
        console.log("Test Result VAlid: " + this.shoppingcart[x]['Quantity']);
        this.shoppingcart[x]['Quantity'] += 1;
        console.log("Cart Item Updated!!!!!!!", this.shoppingcart[x]);
        this.rePackagedCart['' + this.shoppingcart[x]['CartItemId']] = JSON.stringify(this.shoppingcart[x]);
      }
      else {
        this.rePackagedCart['' + this.shoppingcart[x]['CartItemId']] = JSON.stringify(this.shoppingcart[x]);
      }
    }

    console.log("%%%%%%%%%%TESTTEST$$$$$$$$$$$", this.rePackagedCart);

    this.cartItemToUpdate['cart'] = JSON.stringify(this.rePackagedCart);

    let observable = this._httpService.EditItemFromCart(key, this.userid, productid, false, this.cartItemToUpdate);
    observable.subscribe(data => {
      console.log(data);
      window.localStorage.setItem('UpdateCartTest', JSON.stringify(data));
    });

  }

}
