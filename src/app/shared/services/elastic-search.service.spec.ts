import { inject, TestBed } from '@angular/core/testing';

import { ElasticBackendSearchService } from './elastic-search.service';

describe('ElasticBackendSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElasticBackendSearchService]
    });
  });

  it('should be created', inject([ElasticBackendSearchService], (service: ElasticBackendSearchService) => {
    expect(service).toBeTruthy();
  }));
});
