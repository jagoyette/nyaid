import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';
import { NyaidUserService } from '../services/nyaid-user.service';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {
  public requests: RequestInfo[];


  constructor(private nyaidApiService: NyaidWebAppApiService,
    private userService: NyaidUserService,
    private router: Router) { }

  ngOnInit() {
    if (this.userService.currentUser) {
      this.nyaidApiService.getRequestsCreatedByUser(this.userService.currentUser.uid).subscribe(data => {
        this.requests = data;
        console.log('Found ' + this.requests.length + ' requests');

        // Retrieve all offers for each request
        this.requests.forEach(request => {
          this.nyaidApiService.getAllOffers(request.requestId).subscribe(offers => {
            console.log(`Request ${request.requestId} has ${offers.length} offers`);
            if (offers.length > 0) {
              request['offers'] = offers;
            }
          });
        });
      });
    }
  }

  onUpdateRequest(request: RequestInfo): void {
    this.router.navigate(['requests', request.requestId, 'update']);
  }

  onShowOffers(request: RequestInfo): void {
    this.router.navigate(['request', request.requestId, 'offers']);
  }

  onCloseRequest(request: RequestInfo): void {
    request.state = 'closed';
    // TODO: Implement a method to persist the state
/*     this.nyaidApiService.updateRequest(request.requestId, request).subscribe(data => {
      console.log('Update request submitted');
    }); */
  }
}
