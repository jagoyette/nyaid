import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { RequestInfo } from '../models/request-info';

@Component({
  selector: 'app-request-offer',
  templateUrl: './request-offer.component.html',
  styleUrls: ['./request-offer.component.css']
})
export class RequestOfferComponent implements OnInit {
  request: RequestInfo;
  public newOfferForm;

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {

    // Initialize the form data
      this.newOfferForm = this.formBuilder.group({
        description: ['', Validators.required]
      });}

  ngOnInit() {
    // The desired route Id should be extracted from query params
    // and used to populate this.request
    const requestId = this.route.snapshot.paramMap.get('Id');
    this.nyaidApiService.getRequest(requestId).subscribe(data => {
      this.request = data;
    });
  }

  onSubmit(formData) {
    console.log('Submitting new help offer: ' + JSON.stringify(formData));
    console.log('Offer submitted');
  }
}
