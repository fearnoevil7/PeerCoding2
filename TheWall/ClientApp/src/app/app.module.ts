import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, Pipe, PipeTransform, Directive, ErrorHandler  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { from } from 'rxjs';
import { HttpService } from './http.service';
import { AuthGuard } from './auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShowProductComponent } from './show-product/show-product.component';
import { EditComponent } from './edit/edit.component';
import { ProductComponent } from './product/product.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderComponent } from './order/order.component';
import { CanActivate } from '@angular/router';

//import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { Filter1Pipe } from './filter1.pipe';
import { FilterPipe } from './show-product/filter.pipe';
import { NewProductComponent } from './new-product/new-product.component';
import { OrderdetailsComponent } from './orderdetails/orderdetails.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { PaginationDirective } from './pagination.directive';
import { PaginationDirective2 } from './admin-order/pagination2.directive';
import { Ng5SliderModule } from 'ng5-slider';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


//@Pipe({
//  name: "filter",
//})
//class FilterPipe implements PipeTransform {
//  transform(items: any[], searchText: string, fieldName: string): any[] {
//    if (!items) { return []; }

//    if (!searchText) { return items; }

//    searchText = searchText.toUpperCase();

//    return items.filter(item => {
//      if (item && item[fieldName]) {
//        return item[fieldName].toUpperCase().includes(searchText);
//      }
//      return false;
//    })

//  }
//}



export function tokenGrabber() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    RegistrationComponent,
    LoginComponent,
    DashboardComponent,
    EditComponent,
    ProductComponent,
    AdminOrderComponent,
    CheckoutComponent,
    OrderComponent,
    ShowProductComponent,
    Filter1Pipe,
    FilterPipe,
    NewProductComponent,
    OrderdetailsComponent,
    EditProductComponent,
    PaginationDirective,
    PaginationDirective2,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    Ng5SliderModule,
    AngularFontAwesomeModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: 'customers', component: DashboardComponent, canActivate: [AuthGuard] },  //method of authenticating with webtoken using Auth-Guard.service.ts
      { path: 'app/product/show/:id', component: ShowProductComponent, canActivate: [AuthGuard] },
      { path: 'edit', component: EditComponent, canActivate: [AuthGuard] },
      { path: 'products', component: ProductComponent, canActivate: [AuthGuard] },
      { path: 'admin/order', component: AdminOrderComponent, canActivate: [AuthGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: OrderComponent },
      { path: 'new/product', component: NewProductComponent, canActivate: [AuthGuard] },
      { path: 'details/order/:id/:ticket', component: OrderdetailsComponent },
      { path: 'app/product/edit/:id', component: EditProductComponent, canActivate: [AuthGuard] }
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGrabber,
        whitelistedDomains: ["localhost:5001"],
        blacklistedRoutes: []
      }
    })
  ],
  exports: [
    PaginationDirective
  ],
  providers: [
    HttpService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
