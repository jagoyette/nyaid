import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {

  requesthelp() {
    console.log('requesthelp was called');
  }

  helpsomeone() {
    console.log('helpsomeone was called');
  }    
}
