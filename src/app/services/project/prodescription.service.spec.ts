import { TestBed } from '@angular/core/testing';

import { ProdescriptionService } from './prodescription.service';

describe('ProdescriptionService', () => {
  let service: ProdescriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdescriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
