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

  createOrder(order) {
    console.log("*******RouteTeest********!!!!!!!!");
    return this._http.post("order/create", order);
  }

  getOrders() {
    console.log("*******!!!!!!!RoutesTEst*******!!!!!!!!");
    return this._http.get("order/index");
  }

  getOrder(id) {
    return this._http.get("order/show/" + id);
  }

  checkInventory(productid, quantity, customerid) {
    return this._http.get("order/addToCart/" + productid + "/" + quantity + "/" + customerid);
  }

  DeleteItemFromCart(key, userid, productid, quantity) {
    console.log("http remove item from cart", key, userid);
    return this._http.get("order/editCart/delete/" + userid + "/" + key + "/" + productid + "/" + quantity );

  }

  EditItemFromCart(key: number, userid: number, productid: number, incrementOrNah: boolean, shoppingcart) {
    console.log("testing testing testing", key, userid);
    return this._http.post("order/editCart/" + userid + "/" + key + "/" + productid + "/" + incrementOrNah, shoppingcart);

  }

  getProductByCategory(category:string) {
    console.log("HttpServiceCategorytest", category);

    return this._http.get("product/products/" + category);
  }

  updateProduct(productid: number, product: object) {
    return this._http.post("product/update/" + productid, product);
  }

  getProduct(productid: number) {
    return this._http.get("product/show/" + productid);
  }

  getProductsByPrice(maxValue: number, minValue: number) {
    console.log("httpService get products by price max value", maxValue);
    console.log("httpService get products by price min value", minValue);
    return this._http.get("product/pricerange/" + minValue + "/" + maxValue);
  }

  shipItems(productid: number, quantity: number) {
    return this._http.get("product/quantity/" + productid + "/" + quantity);
  }

  PopularProducts() {
    return this._http.get("product/popularity");
  }

}