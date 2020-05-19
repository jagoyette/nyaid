import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  public requests: RequestInfo[];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
  }

  requesthelp() {
    console.log('requesthelp was called');
  }

  helpsomeone() {
    console.log('helpsomeone was called');
    this.http.get<RequestInfo[]>(this.baseUrl + 'api/request').subscribe(result => {
      this.requests = result;
    }, error => console.error(error));
  }    
}
