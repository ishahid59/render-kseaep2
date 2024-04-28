import { TestBed } from '@angular/core/testing';

import { EmpprevemploymentService } from './empprevemployment.service';

describe('EmpprevemploymentService', () => {
  let service: EmpprevemploymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpprevemploymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
