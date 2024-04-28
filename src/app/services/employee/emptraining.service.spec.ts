import { TestBed } from '@angular/core/testing';

import { EmptrainingService } from './emptraining.service';

describe('EmptrainingService', () => {
  let service: EmptrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmptrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
