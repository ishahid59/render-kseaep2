import { TestBed } from '@angular/core/testing';

import { ProownercontactService } from './proownercontact.service';

describe('ProownercontactService', () => {
  let service: ProownercontactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProownercontactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
