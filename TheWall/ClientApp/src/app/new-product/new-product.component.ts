
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpEventType, HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  id: {};
  newProduct: any;
  userid: number;
  products: any;
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();
  imageurl: string;
  searchText: string;

  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this.getProductsFromService();
    this.newProduct = { Name: "", Quantity: null, Description: "", UserId: this.userid, ImageUrl: null };
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
    this.newProduct['ImageUrl'] = window.localStorage.getItem("ImagePath");
    let observable = this._httpService.createProduct(this.newProduct, this.id['id']);
    observable.subscribe(data => {
      console.log("Product successfuly created!", data);
      this.newProduct = { Name: "", Quantity: null, Description: "", UserId: this.userid, ImageUrl: null };
      window.localStorage.removeItem("ImagePath");
      this._route.navigate(["products"]);
    })
  }

  getProductsFromService() {
    let observable = this._httpService.getProducts();
    observable.subscribe(data => {
      this.products = data['Products'];
      console.log("Got our products from service!", this.products);
    })
  }

  onUpload(event) {
    if (event.target.files.length === 0) {
      console.log("&&&&&&&Files.length is 0!!!!!!!");
      return;
    }
    const formData = new FormData();

    for (let file of event.target.files) {
      formData.append(file.name, file);
    }

    const uploadreq = new HttpRequest('POST', `home/test`, formData, { reportProgress: true });
    this.http.request(uploadreq).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event.type === HttpEventType.Response) {
        this.message = event.body['message'];
        window.localStorage.setItem('ImagePath', event.body['path2']);
        this.imageurl = event.body['path2'];
        console.log(window.localStorage.getItem("ImagePath"));
      }

      console.log("Test@@@@@@@@!!!!!!!", this.imageurl);
      console.log("Data@@@@@@@@!!!!!!!", event);
      //if (event['body']['path'] != null) {
      //  console.log("Test@@@@@@@@!!!!!!!", event['body']['path']);
      //}

    });
  }

}
