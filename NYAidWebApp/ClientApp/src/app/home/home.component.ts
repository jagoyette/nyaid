import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  public requests: RequestInfo[];

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private router: Router) {
  }

  requesthelp() {
    console.log('requesthelp was called');
    alert('We still need to implement this');
  }

  helpsomeone() {
    console.log('helpsomeone was called');
    this.goToPage('requests');
    console.log('going to requests page');
  }
  
  goToPage(pageName:string) {
    this.router.navigate([`${pageName}`]);
  }  
}
