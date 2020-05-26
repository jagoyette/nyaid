import { Component, OnInit } from '@angular/core';
import { NyaidWebAppApiService } from 'src/app/services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  public request: RequestInfo;
  private requestId: string;
  public location: string;
  public description: string;

  constructor(private nyaidApiService: NyaidWebAppApiService) {
  }

  ngOnInit() {
    let request = this.nyaidApiService.getData();
    this.requestId = request.requestId;
    this.nyaidApiService.getRequest(this.requestId).subscribe(data => {
      request = data;
      this.request = request;
      this.location = request.location;
      this.description = request.description;
      console.log('Found ' + this.request + ' request');
    });    
  }

}
