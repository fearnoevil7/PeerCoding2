import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
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
import { EditComponent } from './edit/edit.component';
import { ProductComponent } from './product/product.component';
import { AdminOrderComponent } from './admin-order/admin-order.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderComponent } from './order/order.component';
import { CanActivate } from '@angular/router';
 
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

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'login', component: LoginComponent },
      { path: 'customers', component: DashboardComponent, canActivate: [AuthGuard] },  //method of authenticating with webtoken using Auth-Guard.service.ts


      { path: 'edit', component: EditComponent, canActivate: [AuthGuard] },
      { path: 'products', component: ProductComponent, canActivate: [AuthGuard] },
      { path: 'admin/order', component: AdminOrderComponent, canActivate: [AuthGuard] },
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
      { path: 'orders', component: OrderComponent },
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGrabber,
        whitelistedDomains: ["localhost:5001"],
        blacklistedRoutes: []
      }
    })
  ],
  providers: [
    HttpService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
