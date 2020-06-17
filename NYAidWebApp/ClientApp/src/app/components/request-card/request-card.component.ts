import { Component, OnInit, Input } from '@angular/core';
import { RequestInfo } from '../../models/request-info';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent implements OnInit {
  @Input() request: RequestInfo;
  @Input() displayState: boolean;
  @Input() displayPhone: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  public getRequestStateString(request: RequestInfo): string {
    let stateString = '';

    switch (request.state) {
      case 'open':
        stateString = 'Open';
        break;
      case 'inProcess':
        stateString = 'Started';
        break;
      case 'closed':
        stateString = 'Finished';
        break;
    }

    return stateString;
  }
}
