import { TestBed } from '@angular/core/testing';

import { EmpprojectsService } from './empprojects.service';

describe('EmpprojectsService', () => {
  let service: EmpprojectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpprojectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
