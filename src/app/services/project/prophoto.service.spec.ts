import { TestBed } from '@angular/core/testing';

import { ProphotoService } from './prophoto.service';

describe('ProphotoService', () => {
  let service: ProphotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProphotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
