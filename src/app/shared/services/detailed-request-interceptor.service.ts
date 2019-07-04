import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DetailedRequestInterceptor implements HttpInterceptor {

  private _documentCache = {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST' &&
      req.headers.has('X-Request-Type') &&
      req.headers.get('X-Request-Type') === 'detailed') {
    } else {
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
    const parsedBody = JSON.parse(req.body);
    if (parsedBody.ids[0] in this._documentCache) {
      return new HttpResponse<any>({body: this._documentCache[parsedBody.ids[0]]});
    }
  }

  private _put(req: HttpRequest<any>, resp: HttpResponse<any>): void {
    const parsedReqBody = JSON.parse(req.body);
    this._documentCache[parsedReqBody.ids[0]] = resp.body;
  }
}
