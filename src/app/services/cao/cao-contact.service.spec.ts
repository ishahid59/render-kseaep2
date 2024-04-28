import { TestBed } from '@angular/core/testing';

import { CaoContactService } from './cao-contact.service';

describe('CaoContactService', () => {
  let service: CaoContactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaoContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
