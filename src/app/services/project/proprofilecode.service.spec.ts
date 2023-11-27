import { TestBed } from '@angular/core/testing';

import { ProprofilecodeService } from './proprofilecode.service';

describe('ProprofilecodeService', () => {
  let service: ProprofilecodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProprofilecodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
