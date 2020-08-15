import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  id: {};
  productId: number;
  productToUpdate: {};
  product_name: string;
  product_quantity: number;
  product_description: string;
  product_category: string;
  product_price: number;


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
    this.productToUpdate = { name: "", quantity: "", description: "", category: "", price: "" };

  }

  isUserAuthenticated() {
    let token: string = localStorage.getItem("token");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.id = { id: this.jwtHelper.decodeToken(token).nameid };
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
      console.log("Got our product!!!", this.productToUpdate);

    });
  }

  sendProductToUpdate() {
    let observable = this._httpService.updateProduct(this.productId, this.productToUpdate);
    observable.subscribe(data => {
      location.reload();
    });
  }

}
