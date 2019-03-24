import { environment } from '../../../environments/environment';
import { ElasticBackendSearchService } from './elastic-search.service';
import { HttpClient } from '@angular/common/http';
import { SolrBackendSearchService } from './solr-search.service';
import { BackendSearchService } from './backend-search.service';

const backendSearchServiceFactory = (http: HttpClient) => {
  if (environment.backend === 'elastic') {
    return new ElasticBackendSearchService(http);
  }
  if (environment.backend === 'solr') {
    return new SolrBackendSearchService(http);
  }
};

export const backendSearchServiceProvider = {
  provide: BackendSearchService,
  useFactory: backendSearchServiceFactory,
  deps: [HttpClient]
};
