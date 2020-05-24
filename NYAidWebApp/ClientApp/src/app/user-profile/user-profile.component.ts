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
  currentUser: UserInfo;
  accessToken: any;

  constructor(private userService: NyaidUserService, private router: Router) { }

  ngOnInit() {
    this.userService.getUserInfo().subscribe(data => {
      this.currentUser = data;
      console.log('UserInfo: ' + JSON.stringify(data));
    });

    this.userService.getUserAccessToken().subscribe(data => {
      this.accessToken = data;
      console.log('Access Token: ' + JSON.stringify(data));
    });
  }
}
