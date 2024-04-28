import { TestBed } from '@angular/core/testing';

import { ProaddressService } from './proaddress.service';

describe('ProaddressService', () => {
  let service: ProaddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProaddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
