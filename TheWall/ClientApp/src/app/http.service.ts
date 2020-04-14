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

  updateUser(id, user) {
    console.log("Http service update!", user)
    return this._http.post("home/update/" + id, user);
  }

  getUsers() {
    return this._http.get("home/users");
  }
  deleteUser(id) {
    return this._http.get("home/delete/" + id);
  }

  createProduct(newProduct, id) {
    console.log(newProduct);
    console.log(id);
    return this._http.post("product/create/" + id, newProduct);
  }

  getProducts() {
    return this._http.get("product/products");
  }
}
