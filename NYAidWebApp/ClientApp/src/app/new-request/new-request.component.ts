import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
  public newRequestForm;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private router: Router,
              private nyaidApiService: NyaidWebAppApiService) {

    // Initialize the form data
    this.newRequestForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  onSubmit(formData) {
    console.log('Submitting new help request: ' + JSON.stringify(formData));
    this.nyaidApiService.createRequest(formData).subscribe(data => {
      console.log('New request submitted');
      this.router.navigate(['/']);
    });
  }

}
