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
    return this._http.post("home/user/create", newUser);
  }

  createSession(loggedUser) {
    console.log("Login HttpService!!!!!!!!", loggedUser)
    return this._http.post("home/session/create", loggedUser);
  }

  getUser(id) {
    console.log("*******Http showUser id test", id);
    return this._http.get("home/user/" + id);
  }

  updateUser(user) {
    return this._http.post("home/user/update", user);
  }
}
