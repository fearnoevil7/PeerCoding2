import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  id: {};
  newProduct: any;
  userid: number;
  products: any;
  count: number;
  CustomerCart = [];

  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this.getProductsFromService();
    this.newProduct = { Name: "", Quantity: null, Description: "", UserId: this.userid };
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

  logOut() {
    window.localStorage.clear();
    this._route.navigate([""]);
  }

  sendToCreate() {
    let observable = this._httpService.createProduct(this.newProduct, this.id['id']);
    observable.subscribe(data => {
      console.log("Product successfuly created!", data);
      this.newProduct = { Name: "", Quantity: null, Description: "", UserId: this.userid };
    })
  }

  getProductsFromService() {
    let observable = this._httpService.getProducts();
    observable.subscribe(data => {
      this.products = data['Products'];
      console.log("Got our products from service!", this.products);
    })
  }

  addToCart(id) {
    this.CustomerCart.push({ id: id, quantity: this.count });
    console.log("****CustomerCartLog********");
    console.log(this.CustomerCart);
  }

}
