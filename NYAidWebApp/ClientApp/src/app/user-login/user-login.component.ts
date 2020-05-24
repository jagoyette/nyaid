import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  loginWithFacebook() {
    this.router.navigateByUrl('/.auth/login/facebook?post_login_redirect_url=/');
  }
}
