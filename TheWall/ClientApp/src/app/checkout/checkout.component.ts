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
  CustomerCart: {};
  newOrder: any;

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
    this.newOrder = { UserId: null, Quantity: null, Products: null };
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
      console.log(JSON.parse(data['User']['ShoppingCart']));
      Object.keys(JSON.parse(data['User']['ShoppingCart'])).forEach(function (key) {
        console.log(key + " $-$ " + JSON.parse(data['User']['ShoppingCart'])[key]);
        array.push(JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key]));
        //console.log(key + " &-& " + JSON.parse(data['User']['ShoppingCart'])[key]);


      });
      this.shoppingcart = array;
      console.log("*******Test!!!!!!!********", this.shoppingcart);
    })
  }

  placeOrder() {
    console.log("Check!!!!!!!");
    console.log("*******NewOrder*******", this.newOrder);
    var shoppingCart = JSON.parse(`{"ShoppingCart" : ${this.newOrder['Products']}}`);
    this.newOrder['Products'] = shoppingCart;
    let observable = this._httpService.createOrder(this.newOrder);
    observable.subscribe(data => {
      console.log("Success!!!!!!!");
      console.log(data);
      this.newOrder = { UserId: null, Quantity: null, Products: null };
    })
  }

}
