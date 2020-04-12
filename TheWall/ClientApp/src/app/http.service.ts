import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http: HttpClient) { }
  create(newUser) {
    console.log("http service user", newUser);
    return this._http.post("weatherforecast/create", newUser);
  }
}
