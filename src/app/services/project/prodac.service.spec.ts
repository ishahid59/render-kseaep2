import { TestBed } from '@angular/core/testing';

import { ProdacService } from './prodac.service';

describe('ProdacService', () => {
  let service: ProdacService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdacService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
