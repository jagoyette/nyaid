import { Component, OnInit, Input } from '@angular/core';
import { RequestInfo } from '../../models/request-info';

@Component({
  selector: 'app-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.css']
})
export class RequestCardComponent implements OnInit {
  @Input() request: RequestInfo;

  constructor() { }

  ngOnInit(): void {
  }

}
