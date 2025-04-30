import { TestBed } from '@angular/core/testing';

import { EmpresumetextService } from './empresumetext.service';

describe('EmpresumetextService', () => {
  let service: EmpresumetextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpresumetextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
