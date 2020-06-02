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
    private router: Router,
    private userService: NyaidUserService) { }

  ngOnInit() {
    const userInfo = this.userService.getUserInfo();
    const currentUser = this.userService.currentUser;
    this.nyaidApiService.getAllRequests().subscribe(data => {
      this.requests = data.filter(r => r.creatorUid == currentUser.uid);
      console.log('Found ' + this.requests.length + ' requests');
    });
  }

  onUpdateRequest(request: RequestInfo): void {
    this.router.navigate(['requests', request.requestId, 'update']);
  }

}
