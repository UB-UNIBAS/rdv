import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BasketRequestInterceptor implements HttpInterceptor {

  private _cachedDocuments = {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'POST' &&
      req.headers.has('X-Request-Type') &&
      req.headers.get('X-Request-Type') === 'basket') {
      const [newRequest, cachedDocuments] = this._get(req);
      if (!newRequest) {
        return of(cachedDocuments);
      } else if (cachedDocuments.length === 0) {
        return next.handle(req).do(event => {
          if (event instanceof HttpResponse) {
            this._put(event)
          }
        });
      } else if (cachedDocuments && newRequest) {
        return next.handle(req).do(event => {
          if (event instanceof HttpResponse) {
            this._put(event)
          }
        }).map(event => {
            if (event instanceof HttpResponse) {
              return new HttpResponse<any>({
                body: {
                  ...event.body,
                  response: {
                    ...event.body.response,
                    docs: event.body.response.docs.concat(cachedDocuments),
                  }
                },
                headers: event.headers,
                status: event.status,
                statusText: event.statusText,
                url: event.url
              })
            } else {
              return event;
            }
          }
        );
      } else {
        return next.handle(req);
      }
    } else {
      return next.handle(req);
    }
  }

  private _get(req: HttpRequest<any>): [HttpRequest<any>, any] {
    const parsedBody = JSON.parse(req.body);
    const newIds = [];
    const cachedDocuments = [];
    let httpRequest;
    for (const id of parsedBody.ids) {
      if (id in this._cachedDocuments) {
        cachedDocuments.push(this._cachedDocuments[id])
      } else {
        newIds.push(id);
      }
    }
    if (newIds) {
      httpRequest = new HttpRequest('POST', req.url, {
        ...parsedBody, ids: parsedBody.ids.concat(newIds),
      });
    }
    return [httpRequest, cachedDocuments];
  }

  private _put(resp: HttpResponse<any>): void {
    for (const doc of resp.body.response.docs) {
      this._cachedDocuments[doc.id] = doc;
    }
  }
}
