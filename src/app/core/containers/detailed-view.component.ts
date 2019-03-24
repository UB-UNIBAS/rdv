import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BackendSearchService } from '../../shared/services/backend-search.service';

/**
 * Show detailed information on a document
 */
@Component({
  selector: 'app-landing-page',
  template: `
    <div class="container mt-2"
         *ngIf="document">
      <div class="no-gutters p-2 bg-info text-white rounded">

        <!-- Data: {{landingpageData | json}} -->

        <h3>{{document.Titel}}</h3>
        <!--
        <h5>
          <div ="let person of landingpageData.Person">
            {{person}} [Autor]
          </div>
        </h5>
      -->
        <ul>
          <li>Verfasser/in: {{document['Verfasser\/in']}}</li>
          <li>Sprache: {{document.Sprache}}</li>
          <li>Form: {{document.Form}}</li>
          <li>Jahr: {{document.Jahr}}</li>
          <li>Kommentar: {{document.Kommentar}}</li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedViewComponent implements OnInit {
  /**
   * Identifier of document
   */
  id: string;
  // TODO: Interface definieren
  /**
   * Object with document information
   */
  document;

  /**
   * @ignore
   */
  constructor(private _backendSearchService: BackendSearchService, private _route: ActivatedRoute) {
  }

  /**
   * Retrieve document data from backend
   */
  ngOnInit() {
    this._route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this._backendSearchService
        .getBackendDetailData(this.id, true)
        .subscribe(res => this.document = res);
    });
  }
}
