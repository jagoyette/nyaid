import { Component, OnInit } from '@angular/core';
import { NyaidUserService } from '../services/nyaid-user.service';
import { UserInfo } from '../models/user-info';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  currentUser: UserInfo;

  constructor(private userService: NyaidUserService) {}

  ngOnInit(): void {
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
    this.userService.getUserInfo().subscribe(data => {
      console.log('received current user: ' + JSON.stringify(data));
      this.currentUser = data;
    });
  }

  isUserSignedIn(): boolean {
    return this.currentUser != null;
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
