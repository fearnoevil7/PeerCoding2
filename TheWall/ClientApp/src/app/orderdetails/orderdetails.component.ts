import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-orderdetails',
  templateUrl: './orderdetails.component.html',
  styleUrls: ['./orderdetails.component.css']
})
export class OrderdetailsComponent implements OnInit {

  id: {};
  userid: number;
  orderdeserialized = [];
  ParsedOrders = [];
  customername: string;
  customer: {};
  order: {};
  routeid: any;
  ticketnumber: any;

  constructor(
    private _httpService: HttpService,
    private _router: Router,
    private _route: ActivatedRoute,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    //this.getOrdersFromService();
    this._route.params.subscribe((params: Params) => {
      console.log("*******Params********", params);
      console.log("*******Edit Component Params*******", params['id'])
      this.routeid = params['id']
      this.ticketnumber = params['ticket']
    })
    this.grabOrder(this.routeid);

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
    this._router.navigate([""]);
  }

  //getOrdersFromService() {
  //  let observable = this._httpService.getOrders();
  //  observable.subscribe(data => {
  //    //console.log("Destringify", data['Orders']['Products']);
  //    console.log("Orders!!!!!!!", data['Orders']);
  //    for (var i = 0; i < data['Orders'].length; i++) {
  //      console.log("Destringify Object's products", JSON.parse(data['Orders'][i]['Products']));
  //      console.log(data['Orders'][i]);
  //      var firststep = JSON.parse(data['Orders'][i]['Products']);
  //      console.log("&&&&&&&&Firstep^^^^^^^^", firststep);
  //      for (var x = 0; x < JSON.parse(data['Orders'][i]['Products']).length; x++) {
  //        console.log("TEEEEEESSTT", JSON.parse(data['Orders'][i]['Products'])[x]);

  //        this.ordersdeserialized.push(JSON.parse(data['Orders'][i]['Products'])[x]);
  //        this.customer = JSON.parse(data['Orders'][i]['Products'])[x]['Customer'];
  //        this.customername = JSON.parse(data['Orders'][i]['Products'])[x]['Customer']['FirstName'];
  //        console.log("TEEEEEESSTT", this.customername);
  //      }

  //      //this.ParsedOrders.push(JSON.parse(firststep['Test']));
  //      //console.log("object", data['Orders'][i]);

  //    }
  //    console.log("UnpackedOrders", this.ordersdeserialized);
  //    console.log("Testing Parsed Orders Array!", this.ParsedOrders);
  //    console.log("got our pending orders!", this.ordersdeserialized);

  //  })
  //}

  grabOrder(id){
    let observable = this._httpService.getOrder(id);
    observable.subscribe(data => {
      console.log(data['Order']);
      console.log("Destringify Object's products", JSON.parse(data['Order']['Products']));
      
      for (var x = 0; x < JSON.parse(data['Order']['Products']).length; x++) {
        console.log("TEEEEEESSTT", JSON.parse(data['Order']['Products'])[x]);

        this.orderdeserialized.push(JSON.parse(data['Order']['Products'])[x]);
        this.customer = JSON.parse(data['Order']['Products'])[x]['Customer'];
        this.customername = JSON.parse(data['Order']['Products'])[x]['Customer']['FirstName'];
        console.log("TEEEEEESSTT", this.customername);
        }
      console.log("UnpackedOrders", this.orderdeserialized);
      console.log("Testing Parsed Order Array!", this.ParsedOrders);
      console.log("got our pending order!", this.orderdeserialized);

    })
  }

}
