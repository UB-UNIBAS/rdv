import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * @ignore
 */
declare var LZString: any;

/**
 * Provides a button to generate an URL containing JSON data in encoded form
 */
@Component({
  selector: 'app-copy-link',
  template: `
    <button [ngClass]="{'p-1': small}" class="btn btn-primary fa fa-link"
            ngxClipboard
            [cbContent]="generateQueryLink(data, mode)">
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyLinkComponent {
  /**
   * The data to be encoded. JSON is expected
   */
  @Input() data;
  /**
   * Key name of encoded data (i.e. the value)
   */
  @Input() mode = 'search';
  /**
   * Display small button
   */
  @Input() small = false;

  /**
   * Generates URL containing encoded data
   * @param {Object} jsonObject JSON data
   * @param {string} mode Key name of encoded data
   */
  // noinspection JSMethodCanBeStatic
  generateQueryLink(jsonObject: any, mode: string): string {
    const jsonString = JSON.stringify(jsonObject);
    const lzString = LZString.compressToEncodedURIComponent(jsonString);
    return environment.baseUrl + "/search?" + mode + "=" + lzString;
  }
}
