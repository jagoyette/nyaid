import { TestBed } from '@angular/core/testing';

import { NyaidWebAppApiService } from './nyaid-web-app-api-service';

describe('NyaidWebAppApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create an instance', () => {
    const service: NyaidWebAppApiService = TestBed.inject(NyaidWebAppApiService);
    expect(service).toBeTruthy();
  });
});
