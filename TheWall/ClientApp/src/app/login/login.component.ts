import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: any;

  constructor(
    private _httpService: HttpService,
    private _route: Router,
    private _router: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.login = { email: "", password: "" };
  }

  Create() {
    let observable = this._httpService.createSession(this.login);
    observable.subscribe(data => {
      console.log("User successfully signed in!", data);
      window.localStorage.setItem("token", data["Token"]);
      console.log("locally stored token!!!!!!!", window.localStorage.getItem("token"));
      
      this.login = { email: "", password: "" };
      this.goToDashboard();
    })
  }
  goToDashboard() {
    this._route.navigate(["dashboard"]);
  }

}
