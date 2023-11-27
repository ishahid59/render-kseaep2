import { TestBed } from '@angular/core/testing';

import { ProteamService } from './proteam.service';

describe('ProteamService', () => {
  let service: ProteamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProteamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
