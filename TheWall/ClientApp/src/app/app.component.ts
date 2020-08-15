import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, HostListener, ElementRef, Renderer2, Inject } from '@angular/core';
import { HttpService } from './http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpEventType, HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DOCUMENT } from '@angular/common'; 




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {



  title = 'app';
  popular_Products = [];
  id: {};
  userid: number;
  user: {};
  shoppingcart2 = [];
  numberItemsInCart: number;
  productId: number;
  quantity1: number;
  newUser: any;

  RegisterOrNah: boolean;

  ToRegister:boolean = true;

  DoNotRegister:boolean = false;

  login: any;

  closeResult: string;



  constructor(
    private el: ElementRef, private renderer: Renderer2,
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private modalService: NgbModal,
    @Inject(DOCUMENT) document,
  ) { }


  ngOnInit() {
    this.getProductsByPopularity();
    this.isUserAuthenticated();
    this.login = { email: "", password: "" };
    this.newUser = { FirstName: "", LastName: "", Email: "", Password: "", ConfirmPassword: "" };
  }

  getProductsByPopularity() {
    let observable = this._httpService.PopularProducts();
    observable.subscribe(data => {
      this.popular_Products = data['Products'];
      console.log("###########Products according to most sold!!!!", this.popular_Products);
    });
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


  addToCart(productId: number) {
    //console.log("********SuperTest*******", this.productId);

    let observable = this._httpService.checkInventory(productId, Math.abs(this.quantity1), this.userid);
    observable.subscribe(data => {
      console.log(data);
      window.localStorage.setItem("admin-order-killswitch", 'false');
      location.reload();

      //this.ReturnToPage();
      //this.CustomerCart.push({ productid: this.productId, quantity: this.quantity1, vendorId: data['VendorId'], lastName: data['VendorLastName'], firstName: data['VendorFirstName'], email: data['VendorEmail'] });
      //console.log("****CustomerCartLog********");
      //console.log(this.CustomerCart);

    })
  }

  goToDashboard() {
    this._route.navigate(["customers"]);
  }


  logOut() {
    window.localStorage.clear();
    this._route.navigate([""]);
  }

  CreateUser() {
    console.log("User going to http.", this.newUser);
    let observable = this._httpService.create(this.newUser);
    observable.subscribe(data => {
      console.log("New User successfully created!", data);
      this.newUser = { FirstName: "", LastName: "", Email: "", Password: "", ConfirmPassword: "" };
    })
  }

  CalculateCurrentPage(currentCategory: string) {
    console.log("Current category: ", currentCategory);
  }
}
