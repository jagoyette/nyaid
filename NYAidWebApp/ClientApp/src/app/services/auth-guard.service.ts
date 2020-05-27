import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NyaidUserService } from './nyaid-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private userService: NyaidUserService, private router: Router) { }

  // canActivate checks if we have a signed in user and can be used
  // to prevent route navigation to a protected resource.
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return new Promise<boolean>((resolve, reject) => {

      // Check for an authenticated user
      this.userService.getUserInfo().subscribe(data => {
        if (!data) {
          // No user, go to login
          this.router.navigate(['login']);
          resolve(false);
        }

        // valid user, allow navigation to proceed
        resolve(true);
      });
    });
  }

}
