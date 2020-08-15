import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpEventType, HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  id: {};
  userid: number;
  user: {};
  shoppingcart2 = [];
  numberItemsInCart: number;

  numOfClothingItems: number;
  numOfElectronics: number;
  numOfJewlery: number;
  allItems: number;
  category: string;
  moreItems: number;



  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.getProductsFromService();
    this.getAllClothingProducts();
    this.getAllElectronics();
    this.getAllJewlery();
    this.moreItems = this.allItems - this.numOfJewlery - this.numOfClothingItems - this.numOfElectronics;
  }

  isUserAuthenticated() {
    let token: string = localStorage.getItem("token");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.id = { id: this.jwtHelper.decodeToken(token).nameid };
      this.userid = parseInt(this.jwtHelper.decodeToken(token).nameid, 10);
      this.currentUser();
      console.log("*******!!!!!!!!********!!!!!!!!", this.id);
      console.log("*******!!!!!!!!********!!!!!!!!", this.jwtHelper.decodeToken(token));
      return true;
    } else {
        console.log("$$$$$$$$No User Currently in session!!!!!!!!!!");
      return false;
    }
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
      this.numberItemsInCart = this.shoppingcart2.length;
      console.log("*******Test!!!!!!!********", this.shoppingcart2);
    })
  }

  getAllClothingProducts() {
    this.category = 'clothing';
    let observable = this._httpService.getProductByCategory(this.category);
    observable.subscribe(data => {
      this.numOfClothingItems = data['Products'].length;
    })
  }

  getAllElectronics() {
    this.category = 'Electronics';
    let observable = this._httpService.getProductByCategory(this.category);
    observable.subscribe(data => {
      this.numOfElectronics = data['Products'].length;
    });
  }

  getAllJewlery() {
    this.category = 'Jewelry';
    let observable = this._httpService.getProductByCategory(this.category);
    observable.subscribe(data => {
      this.numOfJewlery = data['Products'].length;
    });
  }

  getProductsFromService() {
    let observable = this._httpService.getProducts();
    observable.subscribe(data => {
      this.allItems = data['Products'].length;
    })
  }

}
