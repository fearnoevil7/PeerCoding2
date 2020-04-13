import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  id: {};
  @Input() user: any;
  updateUser: {};
  first_Name: string;
  last_Name: string;
  _email: string;

  constructor(
    private _httpService: HttpService,
    private _router: ActivatedRoute,
    private _route: Router,
    private jwtHelper: JwtHelperService,
  ) { }

  ngOnInit() {
    this.isUserAuthenticated();
    this.showUser();
    this.updateUser = { firstName: "", lastName: "", email: "", password: "" };
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

  logOut() {
    window.localStorage.clear();
    this._route.navigate([""]);
  }

  showUser() {
    console.log("*******showUser id test", this.id);
    let observable = this._httpService.getUser(this.id['id']);
    observable.subscribe(data => {
      this.user = data['User'];
      console.log("Got the selected user", this.user);
      console.log("Got the selected user's email", this.user['Email']);
      this.first_Name = this.user['FirstName'];
      this.last_Name = this.user['LastName'];
      this._email = this.user['Email'];
    })
  }

}
