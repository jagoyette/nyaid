import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NyaidWebAppApiService } from '../services/nyaid-web-app-api-service';
import { NyaidUserService } from '../services/nyaid-user.service';
import { RequestInfo } from '../models/request-info';
import { UserInfo } from '../models/user-info';
import { NewOfferInfo } from '../models/newoffer-info';


@Component({
  selector: 'app-request-offer',
  templateUrl: './request-offer.component.html',
  styleUrls: ['./request-offer.component.css']
})
export class RequestOfferComponent implements OnInit {
  request: RequestInfo;
  public newOfferForm;

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private nyaidUserService: NyaidUserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router) {

      // Initialize the form data
      this.newOfferForm = this.formBuilder.group({
        description:  ['', Validators.required]
      });
    }

  ngOnInit() {
    // The desired route Id should be extracted from query params
    // and used to populate this request
    const requestId = this.route.snapshot.paramMap.get('Id');
    this.nyaidApiService.getRequest(requestId).subscribe(data => {
      this.request = data;
    });
  }

  onSubmit(formData) {
    // TODO: The createOffer method requires a NewOfferInfo object to
    // be supplied. use the description from the formData and the uid
    // of the currentUser to create a NewOfferInfo object.

    // Populate the new offer
    // console.log('Submitting new help offer: ' + JSON.stringify(formData));
    // this.nyaidApiService.createOffer(formData).subscribe(data => {
    //   console.log('New request submitted');
    //   this.goToPage('requests');
    // });
  }

  goToPage(pageName: string) {
    this.router.navigate([`${pageName}`]);
  }
}
