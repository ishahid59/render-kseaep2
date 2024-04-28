import { TestBed } from '@angular/core/testing';

import { EmpexpsummaryService } from './empexpsummary.service';

describe('EmpexpsummaryService', () => {
  let service: EmpexpsummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpexpsummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
