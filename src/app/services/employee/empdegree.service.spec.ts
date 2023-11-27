import { TestBed } from '@angular/core/testing';

import { EmpdegreeService } from './empdegree.service';

describe('EmpdegreeService', () => {
  let service: EmpdegreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpdegreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
