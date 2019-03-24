import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {environment} from "../../../environments/environment";
import {select, Store} from "@ngrx/store";

import * as fromSearch from '../reducers';
import * as fromQueryActions from '../actions/query.actions';
import * as fromDetailedResultActions from '../actions/detailed-result.actions';
import {Observable} from "rxjs";

@Component({
  selector: 'app-result-row',
  template: `
    <!-- 1. Zeile mit Hauptinfos -->
    <div class="d-flex flex-column flex-sm-row mh-table-row-main no-gutters">

      <!-- Ueber Spaltenfelder gehen -->
      <ng-container *ngFor="let field of tableFields; first as first; index as index">

        <!-- Spalte -->
        <div [class]="field.css + ' d-flex no-gutters py-1 px-2'"
             [class.mh-sort-by-column]="index === sortColumn">

          <!-- Label ("Titel: "") nur bei kleinster Darstellung (vertikal) anzeigen -->
          <label class="d-sm-none font-weight-bold text-right mr-2">{{field.label}}</label>

          <!-- Wenn kein Wert gesetzt ist -->
          <span *ngIf="getType(doc[field.field]) === 'unset'"
                class="col"
                [class.mh-flex-1]="first">
                      <i>ohne</i>
                    </span>

          <!-- Wenn es ein Einzelwert ist (z.B. ID, Jahr,...), einfach Wert ausgeben -->
          <span *ngIf="getType(doc[field.field]) === 'single'"
                class="col"
                [class.mh-flex-1]="first">{{doc[field.field]}}</span>

          <!-- Wenn es ein Multiwert ist (z.B. Personen, Schlagwoerter,...), Werte aggregiert ausgeben -->
          <span *ngIf="getType(doc[field.field]) === 'multi'"
                class="col">

                      <!-- Ueber Werte (z.B. einzelne Personen) gehen -->
                      <ng-container *ngFor="let singleValue of doc[field.field], last as last">

                        <!-- Wert ausgeben -->
                        {{singleValue}}

                        <!-- Wenn es nicht der letzte Wert war ein <br> einfuegen -->
                        <br *ngIf="!last">
                      </ng-container>
                    </span>

          <!-- ggfs. einen Link auf Landing Page -->
          <a *ngIf="field.landingpage === true"
             class="d-none d-sm-block btn btn-sm btn-primary fa fa-info p-1 mb-1"
             [routerLink]="['/doc', doc.id]"></a>

          <!-- ggfs. einen Button zum Einblenden der zusaetzlichen Infos, erst ab sm sichtbar sichtbar -->
          <button *ngIf="field.extraInfo === true"
                  class="d-none d-sm-block btn btn-sm btn-primary fa p-1"
                  [class.fa-arrow-down]="!hasDetailedViewOpen(doc.id)"
                  [class.fa-arrow-up]="hasDetailedViewOpen(doc.id)"
                  (click)="toggleDetailedView(doc.id)"></button>
        </div>
      </ng-container>

      <app-basket-icon [basketElement]="doc.id"></app-basket-icon>
    </div>

    <!-- Link auf Landing Page und Button zum Einblenden der zusaetzlichen Infos, nur bei schmalster Breite sichtbar -->
    <div
      *ngIf="tableFieldsDisplayLandingpage || tableFieldsDisplayExtraInfo"
      class="d-flex d-sm-none" style="margin:auto">
      <!-- Link auf Landing Page -->
      <a *ngIf="tableFieldsDisplayLandingpage"
         class="btn btn-primary btn-sm p-1 fa fa-info mb-1"
         [routerLink]="['/doc', doc.id]"></a>

      <!-- Button zum Einblenden der zusaetzlichen Infos -->
      <button *ngIf="tableFieldsDisplayExtraInfo"
              class="btn btn-primary btn-sm p-1 fa mb-1 ml-2"
              [class.fa-arrow-down]="!hasDetailedViewOpen(doc.id)"
              [class.fa-arrow-up]="hasDetailedViewOpen(doc.id)"
              (click)="toggleDetailedView(doc.id)">
      </button>
    </div>

    <!-- Zusatzzeile mit Details anzeigen, wenn sichtbar -->
    <div class="mh-table-row-info no-gutters"
         *ngIf="(detailedViewIds$ | async).indexOf(doc.id) > -1">

      <!-- Ueber Felder der Config gehen -->
      <ng-container *ngFor="let key of extraInfos | objectKeys">

        <!-- 1 grosse Zelle fuer Inhalt, anzeigen, wenn es Daten zu diesem Feld gibt -->
        <div class="col-12 d-flex no-gutters"
             *ngIf="(detailedView$ | async)[doc.id][extraInfos[key].field]?.length">

          <!-- Ueberschrift links (z.B. "Schlagwoerter") -->
          <label class="font-weight-bold text-right mr-2">{{extraInfos[key].label}}</label>

          <!-- Wenn es ein Einzeltwert ist, Wert ausgeben und mit innerHTML binden, damit auch HTML (z.B. <a>) moeglich ist -->
          <span class="col"
                *ngIf="getType((detailedView$ | async)[doc.id][extraInfos[key].field]) === 'single'"
                appDisplayLink [value]="(detailedView$ | async)[doc.id][extraInfos[key].field]"
                [display]="extraInfos[key].display">
                    </span>

          <!-- Wenn es ein Multiwert ist -->
          <span class="col"
                *ngIf="getType((detailedView$ | async)[doc.id][extraInfos[key].field]) === 'multi'">

                      <!-- Ueber Werte (z.B. einzelne Schlagwoerter) gehen -->
                      <ng-container
                        *ngFor="let value of (detailedView$ | async)[doc.id][extraInfos[key].field]; last as isLast;">

                        <!-- Wert ausgeben, mit innerHTML binden, damit auch HTML (z.B. <a>) moeglich ist -->
                        <span appDisplayLink [value]="value" [display]="extraInfos[key].display"></span>

                        <!-- Zeilenumbruch, wenn nicht der letzte Wert -->
                        <br *ngIf="!isLast">
                      </ng-container>
                    </span>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .mh-flex-1 {
      flex: 1;
    }

    label {
      margin-bottom: 0;
    }

    @media (min-width: 576px) {
      .mh-sort-by-column {
        background-color: rgba(0, 255, 255, 0.05);
      }

      .mh-table-row-main > div {
        word-break: break-word;
        border-top: 1px solid grey;
        border-left: 1px solid grey;
      }

      .mh-table-row-main > div:first-of-type, .mh-table-header > div:first-of-type {
        border-left: 0;
      }

      .mh-table-row-info {
        border-top: 1px solid grey;
      }
    }

    div > div > label {
      width: 140px;
    }

    div > div > label:after {
      content: ''
    }


  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultRowComponent {
  @Input() doc: any;

  detailedView$: Observable<any>;
  detailedViewIds$: Observable<any>;

  readonly extraInfos = environment.extraInfos;
  readonly tableFields = environment.tableFields;
  readonly tableFieldsDisplayLandingpage = environment.tableFields.reduce((agg, field) =>
    !agg && field.hasOwnProperty('landingpage') && field['landingpage'],
    false);
  readonly tableFieldsDisplayExtraInfo = environment.tableFields.reduce((agg, field) =>
    !agg && field.hasOwnProperty('extraInfo') && field['extraInfo']
    , false);

  private _detailedViewIds: any;

  constructor(private _searchStore: Store<fromSearch.State>) {

    this.detailedView$ = _searchStore.pipe(select(fromSearch.getAllDetailedResults));
    this.detailedViewIds$ = _searchStore.pipe(select(fromSearch.getDetailedResultsIds));
    this.detailedViewIds$.subscribe(ids => this._detailedViewIds = ids);
  }

  // noinspection JSMethodCanBeStatic
  getType(obj) {
    if (!obj) {
      return 'unset';
    } else if (obj.constructor === Array) {
      return "multi";
    } else {
      return "single";
    }
  }

  toggleDetailedView(id: string) {
    if (!this.hasDetailedViewOpen(id)) {
      this._searchStore.dispatch(new fromQueryActions.MakeDetailedSearchRequest(id));
    } else {
      this._searchStore.dispatch(new fromDetailedResultActions.DeleteDetailedResult({id: id}));
    }
  }

  hasDetailedViewOpen(id: string) {
    return this._detailedViewIds.indexOf(id) > -1;
  }
}
