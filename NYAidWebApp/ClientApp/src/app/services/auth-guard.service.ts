import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NyaidUserService } from './nyaid-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private userService: NyaidUserService, private router: Router) { }

  // canActivate checks if we have a signed in user and can be used
  // to prevent route navigation to a protected resource.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    // Reroute to Login screen if user is not logged in
    if (!this.userService.currentUser) {
      this.router.navigate(['/login']);
    }

    return this.userService.currentUser != null;
  }

}
