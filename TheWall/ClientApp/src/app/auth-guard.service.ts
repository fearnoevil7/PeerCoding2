import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private jwtHelper: JwtHelperService, private _route: Router) {
  }
  canActivate() {
    var token = localStorage.getItem("token");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    this._route.navigate([""]);
    return false;
  }
}
