import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, HostListener, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;

  RegisterOrNah: boolean;

  ToRegister: boolean = true;

  DoNotRegister: boolean = false;

  login: any;

  @Input() CurrentPageLandedOn: string;

  constructor(
    private el: ElementRef, private renderer: Renderer2,
    private _route: Router,
    private modalService: NgbModal,
    private _httpService: HttpService,

  ) { }

  ngOnInit() {
    this.login = { email: "", password: "" };
  }


  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  logOut() {
    window.localStorage.clear();
    this._route.navigate([""]);
  }

  openScrollableContent(longContent, DoIRegister: boolean) {
    console.log("########Modal Test##########", DoIRegister);
    if (DoIRegister == true) {
      this.RegisterOrNah = true;
    } else if (DoIRegister == false) {
      this.RegisterOrNah = false;
    }
    this.modalService.open(longContent, { scrollable: true });
  }

  Create() {
    let observable = this._httpService.createSession(this.login);
    observable.subscribe(data => {
      console.log("User successfully signed in!", data);
      window.localStorage.setItem("token", data["Token"]);
      console.log("locally stored token!!!!!!!", window.localStorage.getItem("token"));
      window.localStorage.setItem("admin-order-killswitch", 'false');
      window.localStorage.setItem("PageUserLandedOn", null);

      this.login = { email: "", password: "" };
      this.goToDashboard();
    })
  }

  goToDashboard() {
    this._route.navigate(["customers"]);
  }
}
