import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public readonly title = AppComponent.title;

  public requests: RequestInfo[];

  constructor(private http: HttpClient,
    private router: Router) {
  }

  requesthelp() {
    console.log('requesthelp was called');
    this.goToPage('requests/new');
  }

  helpsomeone() {
    console.log('helpsomeone was called');
    this.goToPage('requests');
    console.log('going to requests page');
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}

