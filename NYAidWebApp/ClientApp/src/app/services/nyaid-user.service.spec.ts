import { TestBed } from '@angular/core/testing';

import { NyaidUserService } from './nyaid-user.service';

describe('NyaidUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NyaidUserService = TestBed.inject(NyaidUserService);
    expect(service).toBeTruthy();
  });
});
