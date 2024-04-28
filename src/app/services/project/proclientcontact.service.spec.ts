import { TestBed } from '@angular/core/testing';

import { ProclientcontactService } from './proclientcontact.service';

describe('ProclientcontactService', () => {
  let service: ProclientcontactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProclientcontactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
