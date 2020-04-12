import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  newUser: any;

  constructor(private _httpService: HttpService) { }

  ngOnInit() {
    this.newUser = { FirstName: "", LastName: "", Email: "", Password: "", ConfirmPassword: "" };
  }
  CreateUser() {
    console.log("User going to http.", this.newUser);
    let observable = this._httpService.create(this.newUser);
    observable.subscribe(data => {
      console.log("New User successfully created!", data);
      this.newUser = { FirstName: "", LastName: "", Email: "", Password: "", ConfirmPassword: "" };
    })
  }

}
