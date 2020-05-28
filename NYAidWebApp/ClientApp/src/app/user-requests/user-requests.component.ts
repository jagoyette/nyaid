import { Component, OnInit } from '@angular/core';
import { NyaidWebAppApiService } from 'src/app/services/nyaid-web-app-api-service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-requests',
  templateUrl: './user-requests.component.html',
  styleUrls: ['./user-requests.component.css']
})
export class UserRequestsComponent implements OnInit {
  public requests: RequestInfo[];

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private router: Router) { }

  ngOnInit() {
    this.nyaidApiService.getAllRequests().subscribe(data => {
      this.requests = data;
      console.log('Found ' + this.requests.length + ' requests');
    });
  }

  onUpdateRequest(request: RequestInfo): void {
    this.nyaidApiService.setData(request);
    console.log('onUpdateRequest called');
    this.goToPage('request/update');
  }
  
  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
