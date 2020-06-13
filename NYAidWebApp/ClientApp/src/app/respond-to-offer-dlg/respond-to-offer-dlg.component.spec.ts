import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RespondToOfferDlgComponent } from './respond-to-offer-dlg.component';

describe('RespondToOfferDlgComponent', () => {
  let component: RespondToOfferDlgComponent;
  let fixture: ComponentFixture<RespondToOfferDlgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RespondToOfferDlgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RespondToOfferDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
