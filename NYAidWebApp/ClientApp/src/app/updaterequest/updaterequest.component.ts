import { Component, OnInit } from '@angular/core';
import { NyaidWebAppApiService } from 'src/app/services/nyaid-web-app-api-service';
import { FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-updaterequest',
  templateUrl: './updaterequest.component.html',
  styleUrls: ['./updaterequest.component.css']
})
export class UpdaterequestComponent implements OnInit {
  public newRequestForm;

  private name: string;
  private location: string;
  private phone: string;
  private description: string;

  private data: RequestInfo;
  constructor(private nyaidApiService: NyaidWebAppApiService,
    private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.data = this.nyaidApiService.getData();

/*     this.name = this.data.name;
    this.location = this.data.location;
    this.phone = this.data.phone;
    this.description = this.data.description;
 */
    // Initialize the form data
    this.newRequestForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      location: [this.location, Validators.required],
      phone: [this.phone, Validators.required],
      description: [this.description, Validators.required]
    });
      
  }


  onSubmit(formData) {
    console.log('Submitting new help request: ' + JSON.stringify(formData));
    this.nyaidApiService.createRequest(formData).subscribe(data => {
      console.log('New request submitted');
      this.router.navigate(['/']);
    });
  }

}
