import { Component, OnInit } from '@angular/core';
import { NyaidUserService } from '../services/nyaid-user.service';
import { UserInfo } from '../models/user-info';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(public userService: NyaidUserService, private router: Router) { }

  ngOnInit() {
  }

  getProviderDisplayName(userInfo: UserInfo): string {
    let providerName = 'Unknown';
    if (userInfo) {
      switch (userInfo.providerName) {
        case 'facebook':
          providerName = 'Facebook';
          break;
        case 'google':
          providerName = 'Google';
          break;
        case 'microsoftaccount':
          providerName = 'Microsoft';
          break;
      }
    }

    return providerName;
  }

  getProviderLogoUrl(userInfo: UserInfo): string {
    let providerLogoUrl = '';
    if (userInfo) {
      switch (userInfo.providerName) {
        case 'facebook':
          providerLogoUrl = '/assets/facebook_logo.png';
          break;
        case 'google':
          providerLogoUrl = '/assets/google_logo.png';
          break;
        case 'microsoftaccount':
          providerLogoUrl = '/assets/microsoft_logo.png';
          break;
      }
    }

    return providerLogoUrl;
  }

  onMyRequests(): void {
    this.router.navigate(['profile/myrequests']);
  }
}
