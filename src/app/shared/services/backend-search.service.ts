import { Injectable } from '@angular/core';
import { QueryFormat } from '../models/query-format';
import { Observable } from 'rxjs';
import { Basket } from '../../search-form/models/basket.model';

@Injectable({
  providedIn: 'root'
})
export abstract class BackendSearchService {
  abstract getBackendDataComplex(queryFormat: QueryFormat): Observable<any>;

  abstract getBackendDetailData(id: string, fullRecord: boolean): Observable<any>;

  abstract getBackendDataBasket(basket: Basket): Observable<any>;
}
