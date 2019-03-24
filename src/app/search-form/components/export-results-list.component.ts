import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "../../../environments/environment";

/**
 * Provides button to download list of results
 */
@Component({
  selector: 'app-export-results-list',
  template: `
    <a class="btn btn-outline-primary text-sm-center px-2 py-1 mr-2"
       [href]="exportListData"
       (click)="exportList(results)"
       download="export-trefferliste.txt"><i class="fa fa-download"></i> Liste Exportieren</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportResultsListComponent {
  /**
   * Object containing results
   */
  @Input() results: any;

  /**
   * Data as csv file
   */
  exportListData;

  /**
   * @ignore
   */
  private readonly _tableFields = environment.tableFields;

  /**
   * @ignore
   */
  constructor(private _sanitizer: DomSanitizer) {
  }

  /**
   * Generates and sanitizes file of documents
   * @param {Object} docs List of documents
   */
  exportList(docs: any) {
    let dataString = "data:application/octet-stream,";

    for (const field of this._tableFields) {
      dataString += encodeURIComponent(field.label) + "%09";
    }
    dataString += "%0A";

    for (const doc of docs) {
      for (const field of this._tableFields) {
        switch (this.getType(doc[field.field])) {
          case 'unset':
            dataString += "ohne%09";
            break;
          case 'single':
            dataString += encodeURIComponent(doc[field.field]) + "%09";
            break;
          case 'multi':
            dataString += encodeURIComponent(doc[field.field].join("; ")) + "%09";
            break;
        }
      }
      dataString += "%0A";
    }

    this.exportListData = this._sanitizer.bypassSecurityTrustUrl(dataString);
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Checks if respective field value is null, a string or an array
   *
   * @param {Object} obj Field value
   * @returns `unset`, `multi` or `single`
   */
  private getType(obj: any): string {

    //Wert ist nicht gesetzt
    if (!obj) {
      return 'unset';
    } else if (obj.constructor === Array) {
      return "multi";
    } else {
      return "single";
    }
  }
}
