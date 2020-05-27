import { Component, OnInit } from '@angular/core';
import { NyaidUserService } from '../services/nyaid-user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;

  constructor(private userService: NyaidUserService) {}

  ngOnInit(): void {
  }

  isUserSignedIn(): boolean {
    return this.userService.currentUser != null;
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
