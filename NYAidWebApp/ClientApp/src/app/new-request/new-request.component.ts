import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
  public newRequestForm;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string,
              private router: Router) {

    // Initialize the form data
    this.newRequestForm = this.formBuilder.group({
      name: '',
      location: '',
      phone: '',
      description: ''
    });
  }

  ngOnInit() {
  }

  onSubmit(formData) {
    console.log('Submitting new help request: ' + JSON.stringify(formData));
    this.http.post(this.baseUrl + 'api/request', formData).subscribe(data => {
      console.log('New request submitted');
      this.router.navigate(['/']);
    });
  }

}
