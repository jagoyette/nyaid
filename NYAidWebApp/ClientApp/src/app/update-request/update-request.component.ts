import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';

@Component({
  selector: 'app-update-request',
  templateUrl: './update-request.component.html',
  styleUrls: ['./update-request.component.css']
})
export class UpdateRequestComponent implements OnInit {
  public updateRequestForm;
  private request: RequestInfo;

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // The desired route Id should be extracted from query params
    // and used to populate this.request
    const requestId = this.route.snapshot.paramMap.get('Id');
    this.nyaidApiService.getRequest(requestId).subscribe(data => {
      this.request = data;

      // Update the form data
      this.updateRequestForm = this.formBuilder.group({
        name: [this.request.name, Validators.required],
        location: [this.request.location, Validators.required],
        phone: [this.request.phone, Validators.required],
        description: [this.request.description, Validators.required]
      });
    });

    // Initialize the form data
    this.updateRequestForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      phone: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onUpdate(formData) {
    console.log('Updating new help request: ' + JSON.stringify(formData));
    this.nyaidApiService.updateRequest(this.request.requestId, formData).subscribe(data => {
      console.log('Update request submitted');
      this.router.navigate(['profile/myrequests']);
    });
  }

}
