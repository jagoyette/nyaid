import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { RequestsComponent } from './requests/requests.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { UpdaterequestComponent } from './updaterequest/updaterequest.component';
import { RequestComponent } from './request/request.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuardService } from './services/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    RequestsComponent,
    NewRequestComponent,
    UpdaterequestComponent,
    UserProfileComponent,
    RequestComponent,
    UserLoginComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'login', component: UserLoginComponent },
      { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuardService] },
      { path: 'request', component: RequestComponent, canActivate: [AuthGuardService] },
      { path: 'requests/new', component: NewRequestComponent, canActivate: [AuthGuardService] },
      { path: 'request/update', component: UpdaterequestComponent, canActivate: [AuthGuardService]},
      { path: 'requests', component: RequestsComponent, canActivate: [AuthGuardService] },
      { path: '**', component: HomeComponent }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
