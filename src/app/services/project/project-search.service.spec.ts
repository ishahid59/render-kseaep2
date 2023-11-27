import { TestBed } from '@angular/core/testing';

import { ProjectSearchService } from './project-search.service';

describe('ProjectSearchService', () => {
  let service: ProjectSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
