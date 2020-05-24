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

  private fetchCurrentUser() {
    this.currentUser = null;
    this.userService.getUserInfo().subscribe(data => {
      this.currentUser = data;
      console.log('Current user: ' + this.currentUser.name);
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
