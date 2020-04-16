import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  id: {};
  userid: number;
  ordersdeserialized = [];
  ParsedOrders = [];
  customername: string;
  customer: {};

  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this.getOrdersFromService();
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
          console.log("TEEEEEESSTT", JSON.parse(data['Orders'][i]['Products'])[x]);

          this.ordersdeserialized.push(JSON.parse(data['Orders'][i]['Products'])[x]);
          this.customer = JSON.parse(data['Orders'][i]['Products'])[x]['Customer'];
          this.customername = JSON.parse(data['Orders'][i]['Products'])[x]['Customer']['FirstName'];
          console.log("TEEEEEESSTT", this.customername);
        }

        //this.ParsedOrders.push(JSON.parse(firststep['Test']));
        //console.log("object", data['Orders'][i]);

      }
      console.log("UnpackedOrders", this.ordersdeserialized);
      console.log("Testing Parsed Orders Array!", this.ParsedOrders);
      console.log("got our pending orders!", this.ordersdeserialized);

    })
  }

}
