import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-rows-per-page',
  template: `
    <div class="form-inline mr-2 mb-2 mb-md-0">
      <select class="form-control form-control-sm" id="rows" #rowOpt (change)="updateRowsPerPage(+rowOpt.value)">
        <option *ngFor="let rowOpt of rowOpts"
                [value]="rowOpt"
                [selected]="rowsPerPage == rowOpt">
          {{rowOpt}}
        </option>
      </select>
      <label class="form-label ml-2 d-flex justify-content-center"
             for="rows">Treffer pro Seite</label>
    </div>
  `,
  styles: [``],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowsPerPageComponent {
  @Input() rowsPerPage: number;
  @Output() changeRowsPerPage = new EventEmitter<number>();
  rowOpts = environment.rowOpts;

  updateRowsPerPage(no: number) {
    this.changeRowsPerPage.emit(no);
  }
}
