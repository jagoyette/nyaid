import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NyaidWebAppApiService } from 'src/app/services/nyaid-web-app-api-service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  public requests: RequestInfo[];

  constructor(private http: HttpClient,
    private router: Router,
    private nyaidApiService: NyaidWebAppApiService) {
    }

  ngOnInit() {
    this.nyaidApiService.getAllRequests().subscribe(data => {
      this.requests = data;
      console.log('Found ' + this.requests.length + ' requests');
    });
  }

  onAssignRequest(request: RequestInfo): void {
    this.nyaidApiService.setData(request);
    console.log('onAssignRequest called');
    this.goToPage('request');
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }

}
