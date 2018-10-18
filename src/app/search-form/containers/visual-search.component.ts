import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UpdateQueryService } from '../services/update-query.service';
import { SliderService } from '../services/slider.service';
import { FormGroup } from '@angular/forms';
import { IonRangeSliderComponent } from 'ng2-ion-range-slider';
import { QueryFormat } from "../../shared/models/query-format";
import * as fromRoot from "../../reducers/index";
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-visual-search',
  templateUrl: './visual-search.component.html',
  styleUrls: ['./visual-search.component.css']
})
export class VisualSearchComponent implements OnInit {

  @Input() parentFormGroup: FormGroup;

  //Variable fuer SliderElemente -> bei Reset zuruecksetzen
  @ViewChildren('sliderElement') sliderElement: QueryList<IonRangeSliderComponent>;

  //Ranges (leere Wert, z.B. Titel ohne Jahr fuer Checkbox, abgeleitet von results)
  private rangeMissingValues = {};

  //Ranges (fuer Chart, abgeleitet von results)
  private ranges;

  //Facetten (abgeleitet von results)
  facets = {};

  //Daten fuer Slider und Diagrammerzeugunge
  rangeData = {};
  query: QueryFormat;
  facetFieldsByKey$: Observable<any>;
  rangeFieldsByKey$: Observable<any>;
  private rangeFieldsConfig: any;

  constructor(private sliderService: SliderService,
              private updateQueryService: UpdateQueryService,
              private rootState: Store<fromRoot.State>) {
    this.facetFieldsByKey$ = rootState.pipe(select(fromRoot.getFacetFieldsByKey));
    this.rangeFieldsByKey$ = rootState.pipe(select(fromRoot.getRangeFieldsByKey));
    this.rangeFieldsByKey$.subscribe(x => this.rangeFieldsConfig = x);

    updateQueryService.query$.subscribe(q => this.query = q);
    updateQueryService.response$.subscribe(res => {
      //Facetten-Ranges Werte
      this.ranges = res.facet_counts.facet_ranges;
      //Werte fuer nicht existirende Range-Werte (z.B. Eintraege ohne Jahr)
      this.rangeMissingValues = res.facet_counts.facet_queries;
      //Facetten-Werte
      this.facets = res.facet_counts.facet_fields;
      this.createCharts()
    });

  }

  ngOnInit() {
    //min- / max-Werte fuer Slider, Labels und Optionen fuer Chart setzen
    this.setRangeData();
    //Slider Werte setzen
    this.sliderService.resetSlider$.subscribe(res => this.sliderInit(res));
    this.sliderService.resetSlider();
  }

  //min- / max-Werte fuer Ranges setzen
  private setRangeData() {

    //Ueber Felder des Abfrage-Formats gehen
    for (const key of Object.keys(this.query.rangeFields)) {

      //leeren Wert fuer rangeMissingValues anlegen (da sonst undefined)
      this.rangeMissingValues['{!ex=' + this.query.rangeFields[key].field + '}' +
      this.query.rangeFields[key].field + ':0'] = 0;

      //Objekt fuer diese Range (z.B. Jahr) anelegen
      this.rangeData[key] = {};

      //Min und Max-Werte aus Query-Format holen
      this.rangeData[key].min = this.query.rangeFields[key].min;
      this.rangeData[key].max = this.query.rangeFields[key].max;

      //Leeres Datenarray anlegen
      this.rangeData[key].chartData = [{data: []}];

      //Labels erstellen
      const labelArray = [];

      //von min zu max Wert gehen
      for (let i = this.rangeData[key].min; i <= this.rangeData[key].max; i++) {

        //Werte sammeln (1950, 1951,..., 2017)
        labelArray.push(i);
      }

      //Labels sind aber unsichtbar (werden aber fuer Hover benoetigt)
      this.rangeData[key].chartLabels = labelArray;

      //Prefix fuer Slider
      this.rangeData[key].label = this.rangeFieldsConfig(key).label;

      //Chart Optionen
      this.rangeData[key].chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            id: 'left',
            afterFit: function (scaleInstance) {
              scaleInstance.width = 40;
            },
            ticks: {
              beginAtZero: true,
              //nur ganze Zahlen bei Achsen-Label
              callback: function (value) {
                if (value % 1 === 0) {
                  return value;
                }
              }
            },
          },
            {
              id: 'right',
              position: 'right',
              display: false,
              afterFit: function (scaleInstance) {
                scaleInstance.width = 40;
              },
            }]
        }
      };
    }
  }

  //Chart erstellen
  private createCharts() {

    //Chartdata erstellen
    for (const key of Object.keys(this.query.rangeFields)) {

      //Werte sammeln
      const barData = [];
      const backendData = this.ranges[this.query.rangeFields[key].field].counts;

      //Ranges kommen als Array von Arrays [["1800", 2]["1801", 0]["1802", 6],...],
      for (let i = 0; i < backendData.length; i++) {

        //nur den Zaehlwert speichern fuer Chart
        barData.push(backendData[i][1]);
      }

      //Daten fuer Chart speichern
      this.rangeData[key].chartData = [{data: barData}];
    }
  }

  //Slider initialisieren
  private sliderInit(key?) {

    if (this.sliderElement) {
      this.sliderElement.toArray().forEach(value => value.reset());
    }

    //Wenn key uebergeben wird, nur diesen bearbeiten, ansonsten alle keys
    const keys = key ? [key] : Object.keys(this.query.rangeFields);

    //Ueber Rangewerte gehen
    for (const k of keys) {

      //Von und bis Werte fuer Slider setzen
      this.rangeData[k].from = this.query.rangeFields[k].from;
      this.rangeData[k].to = this.query.rangeFields[k].to;

      //Vorhangwerte setzen
      this.rangeData[k].curtainLeft =
        ((1 - (this.rangeData[k].max - this.rangeData[k].from) / (this.rangeData[k].max - this.rangeData[k].min)) * 100) + '%';
      this.rangeData[k].curtainRight =
        ((this.rangeData[k].max - this.rangeData[k].to) / (this.rangeData[k].max - this.rangeData[k].min) * 100) + '%';
    }

  }

  //Beim Ziehen des Sliders
  updateSlider($event, key) {

    //Vorhangswerte setzen
    this.rangeData[key].curtainLeft = $event.from_percent + '%';
    this.rangeData[key].curtainRight = (100 - $event.to_percent) + '%';

    const query = JSON.parse(JSON.stringify(this.query));
    query.rangeFields[key].from = $event.from;
    query.rangeFields[key].to = $event.to;
    query.queryParams.start = 0;
    this.updateQueryService.updateQuery(query);
  }

  //Facette speichern
  selectFacet(field, value) {
    const query = JSON.parse(JSON.stringify(this.query));
    query.facetFields[field]["values"].push(value);
    query.queryParams.start = 0;
    this.updateQueryService.updateQuery(query);
  }

  //Anzahl der Eintraege ohne ein Merkmal (z.B. Titel ohne Jahr)
  getMissingCount(key) {

    //lokal gespeicherten Wert zurueckliefern
    return this.rangeMissingValues['{!ex=' + this.query.rangeFields[key].field + '}' +
    this.query.rangeFields[key].field + ':0'];
  }

}
