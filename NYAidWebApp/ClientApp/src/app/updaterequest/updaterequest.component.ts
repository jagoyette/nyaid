import { Component, OnInit } from '@angular/core';
import { NyaidWebAppApiService } from 'src/app/services/nyaid-web-app-api-service';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { RequestInfo } from '../models/request-info';

@Component({
  selector: 'app-updaterequest',
  templateUrl: './updaterequest.component.html',
  styleUrls: ['./updaterequest.component.css']
})
export class UpdaterequestComponent implements OnInit {
  public updateRequestForm;

  private requestId: string;
  private name: string;
  private location: string;
  private phone: string;
  private description: string;

  private request: RequestInfo;

  constructor(private nyaidApiService: NyaidWebAppApiService,
    private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    const request = this.nyaidApiService.getData();
    this.requestId = request.requestId;

    // populate the old RequesrInfo data
    this.name = request.name;
    this.location = request.location;
    this.phone = request.phone;
    this.description = request.description;

    // Initialize the form data
    this.updateRequestForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      location: [this.location, Validators.required],
      phone: [this.phone, Validators.required],
      description: [this.description, Validators.required]
    });
  }

  onUpdate(formData) {
    console.log('Updating new help request: ' + JSON.stringify(formData));
    this.nyaidApiService.updateRequest(this.requestId, formData).subscribe(data => {
      console.log('Update request submitted');
      this.router.navigate(['/']);
    });
  }

}
