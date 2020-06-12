import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRequestOffersComponent } from './user-request-offers.component';

describe('UserRequestOffersComponent', () => {
  let component: UserRequestOffersComponent;
  let fixture: ComponentFixture<UserRequestOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRequestOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRequestOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
