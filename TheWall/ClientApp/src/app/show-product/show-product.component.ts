import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-show-product',
  templateUrl: './show-product.component.html',
  styleUrls: ['./show-product.component.css']
})
export class ShowProductComponent implements OnInit {
  id: {};
  userid: number;
  productId: number;
  productToUpdate: {};
  product_name: string;
  product_quantity: number;
  product_description: string;
  product_category: string;
  product_price: number;
  product_image: string;
  current_product: any;

  ToIncrement: boolean = true;
  ToDecrement: boolean = false;

  desiredquantity = 1;

  paginatedPages: [];

  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this._router.params.subscribe((params: Params) => {
      this.productId = params['id'];
    });
    this.getProductFromService(this.productId);
    console.log(this.productId);
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


  getProductFromService(productid: number) {
    let observable = this._httpService.getProduct(productid);
    observable.subscribe(data => {
      this.productToUpdate = data['Product'];
      this.product_name = this.productToUpdate['Name'];
      this.product_quantity = this.productToUpdate['Quantity'];
      this.product_description = this.productToUpdate['Description'];
      this.product_category = this.productToUpdate['Category'];
      this.product_price = this.productToUpdate['Price'];
      this.current_product = data['Product'];
      console.log("Got our product!!!", this.productToUpdate);
      console.log("Testing 123 Testing 123!!!!", this.current_product);
      this.product_image = this.current_product['ImageUrl'];

    });
  }

  addToCart(productId: number) {
    //console.log("********SuperTest*******", this.productId);

    let observable = this._httpService.checkInventory(productId, Math.abs(this.desiredquantity), this.userid);
    observable.subscribe(data => {
      console.log(data);
      this._route.navigate(["/admin/order"]);
      this._route.navigate(["/admin/order"]);
      this.paginatedPages = JSON.parse(window.localStorage.getItem("pagination"));
      window.localStorage.setItem("admin-order-killswitch", 'false');
      location.reload();

      //this.ReturnToPage();
      //this.CustomerCart.push({ productid: this.productId, quantity: this.quantity1, vendorId: data['VendorId'], lastName: data['VendorLastName'], firstName: data['VendorFirstName'], email: data['VendorEmail'] });
      //console.log("****CustomerCartLog********");
      //console.log(this.CustomerCart);

    })
  }

  adjustQuantity(IncrementOrDecrement: boolean) {
    if (IncrementOrDecrement == true) {
      this.desiredquantity += 1;
    } else {
      this.desiredquantity -= 1;
    }
  }

}
