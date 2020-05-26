import { Component, OnInit } from '@angular/core';
import { NyaidWebAppApiService } from 'src/app/services/nyaid-web-app-api-service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  public request: RequestInfo;
  private requestId: string

  constructor(private nyaidApiService: NyaidWebAppApiService) { }

  ngOnInit() {
    let request = this.nyaidApiService.getData();
    this.requestId = request.requestId;
    this.nyaidApiService.getRequest(this.requestId).subscribe(data => {
      this.request = data;
      console.log('Found ' + this.request + ' request');
    });
  }

}
