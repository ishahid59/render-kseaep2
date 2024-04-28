import { TestBed } from '@angular/core/testing';

import { Empdisciplinesf330Service } from './empdisciplinesf330.service';

describe('Empdisciplinesf330Service', () => {
  let service: Empdisciplinesf330Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Empdisciplinesf330Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
