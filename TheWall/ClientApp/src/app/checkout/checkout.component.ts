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
      var array2 = this.tackcart;
      console.log(JSON.parse(data['User']['ShoppingCart']));
      Object.keys(JSON.parse(data['User']['ShoppingCart'])).forEach(function (key) {
        console.log(key + " $-$ " + JSON.parse(data['User']['ShoppingCart'])[key]);
        array.push(JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key]));
        array2.push({ key: key, value: JSON.parse(JSON.parse(data['User']['ShoppingCart'])[key]) })
        //console.log(key + " &-& " + JSON.parse(data['User']['ShoppingCart'])[key]);


      });
      this.shoppingcart = array;
      this.tackcart = array2;
      console.log("*******Test!!!!!!!********", this.shoppingcart);
      console.log("!!!!!!*******Test2*******", this.tackcart);

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

  removeFromCart(CartItemId) {
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
    let observable = this._httpService.editShoppingCart(CartItemId, this.userid);
    observable.subscribe(data => {
      console.log(data);
      //Object.keys(data).forEach(function (key) {
      //  console.log(key + " !$-$! " + data[key]);
      //});
    })
  }

}
