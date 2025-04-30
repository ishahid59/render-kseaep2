import { TestBed } from '@angular/core/testing';

import { PropdstextService } from './propdstext.service';

describe('PropdstextService', () => {
  let service: PropdstextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropdstextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
