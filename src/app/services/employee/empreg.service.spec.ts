import { TestBed } from '@angular/core/testing';

import { EmpregService } from './empreg.service';

describe('EmpregService', () => {
  let service: EmpregService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpregService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
