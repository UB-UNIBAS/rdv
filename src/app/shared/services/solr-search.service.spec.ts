import { TestBed, inject } from '@angular/core/testing';

import { SolrSearchService } from './solr-search.service';

describe('SolrSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolrSearchService]
    });
  });

  it('should be created', inject([SolrSearchService], (service: SolrSearchService) => {
    expect(service).toBeTruthy();
  }));
});
