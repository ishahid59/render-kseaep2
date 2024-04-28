import { TestBed } from '@angular/core/testing';

import { EmpmembershipService } from './empmembership.service';

describe('EmpmembershipService', () => {
  let service: EmpmembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpmembershipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
