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
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    // If we already have a user, then we can return true immediately
    if (this.userService.currentUser) {
      return true;
    }

    console.log('Refreshing login status...');
    return new Promise<boolean>((resolve) => {
      // attempt to refresh current user
      this.userService.refreshUserInfo().subscribe(user => {
        // Now we can resolve the promise and proceed if we have a user
        resolve(user != null);

        // Reroute to Login screen if user is not logged in
        if (!user) {
          console.log('No user siged in, redirecting to sign in screen...');
          this.router.navigate(['/login']);
        }

      }, error => {
        resolve(false);
      });
    });
  }
}
