import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { hashCodeFromString } from "../utils";

@Injectable({
  providedIn: 'root'
})
export class SearchRequestInterceptor implements HttpInterceptor {

  private _documentCache = {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'POST') {
      return next.handle(req);
    }

    const cachedResponse = this._get(req);

    return cachedResponse ? of(cachedResponse) : next.handle(req).pipe(tap(event => {
      if (event instanceof HttpResponse) {
        this._put(req, event);
      }
    }));
  }

  private _get(req: HttpRequest<any>): HttpResponse<any> | void {
    if (hashCodeFromString(req.body) in this._documentCache) {
      return new HttpResponse<any>({body: this._documentCache[hashCodeFromString(req.body)]});
    }
  }

  private _put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
    this._documentCache[hashCodeFromString(req.body)] = resp.body;
  }
}
