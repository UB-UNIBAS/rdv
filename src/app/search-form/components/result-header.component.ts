import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-result-header',
  template: `
    <div class="d-flex mh-table-header font-weight-bold">
      <ng-container *ngFor="let field of tableFields; index as index">
        <div *ngIf="field.sort"
             (click)="reSortBy(field.sort)"
             [class]="field.css + ' text-center'"
             [class.mh-sort-by-column]="index === sortColumn">
          {{field.label}}
          <span [class]="'mh-sort fa ' + (index === sortColumn ? sortClass : 'fa-sort')"></span>
        </div>
        <div *ngIf="!field.sort"
             [class]="'text-center ' + field.css">{{field.label}}
        </div>
      </ng-container>
      <div class="col-1 text-center">
        <span class="fa fa-star"></span>
      </div>
    </div>`,
  styles: [`
    @media (min-width: 576px) {
      .mh-table-header > div {
        word-break: break-word;
        border-left: 1px solid grey;
      }
    }

    @media (max-width: 575px) {
      .mh-table-header > div {
        border-top: 1px solid grey;
        border-bottom: 1px solid grey;
        border-left: 1px solid grey;
      }

      .mh-table-header > div:first-child {
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }

      .mh-table-header > div:last-child {
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        border-right: 1px solid grey;
      }
    }

    .mh-table-header {
      background: #ddd;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultHeaderComponent {
  @Input() tableFields: any;

  @Input() set sortOrder(order) {
    this.sortClass = this.sortedBy ?
      (order === 'asc' ? 'fa-sort-asc' : 'fa-sort-desc') :
      'fa-sort';
    this._sortOrder = order;
  }

  @Input() set sortedBy(field) {
    this._sortBy = field;
    this.tableFields.forEach((item, index) => {
      if (item.sort === field) {
        this.sortColumn = index;
      }
    });
  };

  @Output() sortByField = new EventEmitter<string>();

  get sortedBy() {
    return this._sortBy;
  }

  sortColumn = 0;
  sortClass = 'fa-sort';

  private _sortBy;
  private _sortOrder = 'asc';

  reSortBy(field: string) {
    if (field === this.sortedBy) {
      const newSortOrder = this._sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortByField.emit(newSortOrder);
      this.sortOrder = newSortOrder;
    } else {
      this.sortByField.emit(field);
      this.sortOrder = 'asc';
      this.sortedBy = field;
    }
  }
}
