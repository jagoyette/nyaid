import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { RequestsComponent } from './requests/requests.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { UpdateRequestComponent } from './update-request/update-request.component';
import { RequestOfferComponent } from './request-offer/request-offer.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserRequestsComponent } from './user-requests/user-requests.component';
import { UserOffersComponent } from './user-offers/user-offers.component';
import { UserRequestOffersComponent } from './user-request-offers/user-request-offers.component';
import { RespondToOfferDlgComponent } from './respond-to-offer-dlg/respond-to-offer-dlg.component';
import { RequestCardComponent } from './components/request-card/request-card.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RequestsComponent,
    NewRequestComponent,
    UpdateRequestComponent,
    UserProfileComponent,
    RequestOfferComponent,
    UserLoginComponent,
    UserRequestsComponent,
    UserOffersComponent,
    UserRequestOffersComponent,
    RespondToOfferDlgComponent,
    RequestCardComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: UserLoginComponent },
      { path: 'profile', component: UserProfileComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
      { path: 'profile/myrequests', component: UserRequestsComponent },
      { path: 'profile/myoffers', component: UserOffersComponent, canActivate: [AuthGuardService] },
      { path: 'requests', component: RequestsComponent, pathMatch: 'full', canActivate: [AuthGuardService] },
      { path: 'requests/new', component: NewRequestComponent, canActivate: [AuthGuardService] },
      { path: 'requests/:Id/update', component: UpdateRequestComponent, canActivate: [AuthGuardService] },
      { path: 'requests/:Id/offer', component: RequestOfferComponent, canActivate: [AuthGuardService] },
      { path: 'request/:Id/offers', component: UserRequestOffersComponent, canActivate: [AuthGuardService] },
      { path: '**', component: HomeComponent }
    ])
  ],
  entryComponents: [
    RespondToOfferDlgComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
