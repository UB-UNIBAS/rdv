import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-result-paging',
  template: `
    <div class="btn-group btn-group-sm mb-2 mb-md-0"
         role="group"
         aria-label="Small button group">

      <button class="btn btn-primary fa fa-angle-double-left"
              (click)="goToFirstPage()"
              [disabled]="currentPage === 1">
      </button>

      <button class="btn btn-primary fa fa-angle-left"
              (click)="goToPreviousPage()"
              [disabled]="currentPage === 1">
      </button>

      <div class="row-count">{{currentPage}} / {{numberOfPages}}</div>

      <button class="btn btn-primary fa fa-angle-right"
              (click)="goToNextPage()"
              [disabled]="currentPage === numberOfPages"></button>

      <button class="btn btn-primary fa fa-angle-double-right"
              (click)="goToLastPage()"
              [disabled]="currentPage === numberOfPages"></button>
    </div>
  `,
  styles: [`
    div.row-count {
      border-top: 1px solid #868e96;
      border-bottom: 1px solid #868e96;
      width: 80px;
      vertical-align: middle;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultPagingComponent {
  @Input() rowsPerPage: number;
  @Input() numberOfRows: number;
  // tslint:disable-next-line:no-output-rename
  @Output('offset') offsetEmitter = new EventEmitter<number>();

  get numberOfPages(): number {
    return Math.ceil(this.numberOfRows / this.rowsPerPage);
  }

  get currentPage(): number {
    return this._currentOffset % this.rowsPerPage > 1 ?
      Math.ceil(this._currentOffset / this.rowsPerPage) + 1 :
      Math.floor(this._currentOffset / this.rowsPerPage) + 1;
  }

  private set _offset(offset: number) {
    this._currentOffset = offset < 0 ? 0 : offset;
    this.offsetEmitter.emit(this._currentOffset);
  }

  private get _offset() {
    return this._currentOffset;
  }

  private _currentOffset = 0;

  goToNextPage() {
    this._offset += this.rowsPerPage;
  }

  goToPreviousPage() {
    this._offset -= this.rowsPerPage;
  }

  goToFirstPage() {
    this._offset = 0;
  }

  goToLastPage() {
    this._offset = this.rowsPerPage * (this.numberOfPages - 1);
  }
}
