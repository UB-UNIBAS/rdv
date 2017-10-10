import { Component, ViewChildren, QueryList, AfterViewInit, OnInit, HostListener, OnDestroy } from '@angular/core';

//Solr Service
import { SolrSearchService } from "app/solr-search.service";

// Observable operators
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

//Forms
import { FormBuilder } from "@angular/forms";
import { FormGroup, FormControl, Validators } from "@angular/forms";

//eigene Format-Klassen
import { QueryFormat } from "app/query-format";
import { SavedQueryFormat } from "app/saved-query-format";

//Slider-Plugin
import { IonRangeSliderComponent } from "ng2-ion-range-slider";
import { ActivatedRoute } from '@angular/router';

declare var LZString: any;

//Validator-Funktion stellt sicher, dass jede gespeicherte Suche einen eindeutigen Namen hat
function uniqueQueryNameValidator(savedQueries: SavedQueryFormat[]) {
  return (control: FormControl) => {

    //Error-Objekt
    let error = null;

    //Ueber gespeicherte Anfragen gehen
    savedQueries.forEach(function (query) {

      //Wenn Name bereits vorhanden
      if (control.value === query.name) {

        //Fehlerobjekt setzen
        error = {
          uniqueQueryName: { valid: false }
        }
      }
    });

    //Fehlerobjekt zurueckgeben (null, wenn kein Fehler)
    return error;
  }
}

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit, OnDestroy {

  //Variable fuer SliderElemente -> bei Reset zuruecksetzen
  @ViewChildren('sliderElement') sliderElement: QueryList<IonRangeSliderComponent>;

  //Anzahl der Seiten gesamt
  get pages(): number {

    //Anzahl der Seiten gesamt = (Wie viele Treffer gibt es / Wie viele Zeilen pro Einheit)
    return Math.floor(this.count / this.queryFormat.queryParams.rows) + 1;
  }

  //aktuelle Seite beim Blaettern
  get page(): number {

    //aktuelle Seite = (Wo bin ich / Wie viele Zeilen pro Einheit)
    return Math.floor(this.queryFormat.queryParams.start / this.queryFormat.queryParams.rows) + 1
  }

  //Such-Form
  searchForm: FormGroup;

  //Name-Input fuer Suche speichern
  saveQuery: FormControl;

  //Alle Infos zu Suchanfrage hier speichern
  queryFormat = new QueryFormat();

  //Array der gespeicherten Suchanfragen
  savedQueries: SavedQueryFormat[] = [];

  //Results als Observable
  results: Observable<any>;

  //docs Bereich der Solr-Antwort (abgeleitet von results)
  docs: any[];

  //Facetten (abgeleitet von results)
  facets = {};

  //Ranges (fuer Chart, abgeleitet von results)
  ranges;

  //Ranges (leere Wert, z.B. Titel ohne Jahr fuer Checkbox, abgeleitet von results)
  rangeMissingValues = {};

  //Daten fuer Slider und Diagrammerzeugunge
  rangeData = {};

  //Trefferanzahl der Solr-Antwort. Zu Beginn 0 Treffer (spaeter abgeleitet von results)
  count: number = 0;

  //Optionen fuer Auswahl der Treffermenge
  rowOpts: number[] = [5, 10, 20];

  //Optionen fuer Auswahl der Suchfelder
  searchFieldOpts = {
    "all_text": "Freitext",
    "ti_all_text": "Titel",
    "person_all_text": "Person"
  };

  //BehaviorSubject speichert Anfragen, zu Beginn leere Anfrage schicken, damit *:* Suche gestartet wird
  private complexSearchTerms: BehaviorSubject<QueryFormat>;

  //Eintragsdetails (abstract,...) zwischenspeichern, damit sie nicht immer geholt werden muessen
  detailDataArray: any[] = [];

  //Infos aus Link laden, verhindern, dass Link-Query von localStorage ueberschrieben wird
  loadFromLink: boolean = false;

  //SolrSearchService injenten
  constructor(private solrSearchService: SolrSearchService, private _fb: FormBuilder, private route: ActivatedRoute) {

  }

  //Bevor die Seite verlassen wird (z.B. F5 druecken)
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {

    //Werte in Localstorage speichern, damit sie beim Zurueckkehren wieder da sind
    this.writeToLocalStorage();
  }

  //Bei Wegnavigieren (z.B. auf Beschreibungsseite)
  ngOnDestroy(): void {

    //Werte im Localstorage speichern, damit sie beim Zurueckkehren wieder da sind
    this.writeToLocalStorage();
  }

  //Component-Init
  ngOnInit() {

    //gespeicherte Suchanfrage aus localstorage laden -> vor Form-Erstellung, damit diese queries fuer den Validator genutzt werden koennen
    let localStorageSavedUserQueries = localStorage.getItem("savedUserQueries");

    //wenn gespeicherte Suchen aus localstorage geladen wurden
    if (localStorageSavedUserQueries) {

      //gespeicherte Suchen aus localstorage holen
      this.savedQueries = JSON.parse(localStorageSavedUserQueries);
    }

    //Behavior-Subjekt anlegen mit Initialwert queryFormat (enthaelt ggf. Werte, die aus localstorage geladen werden)
    this.complexSearchTerms = new BehaviorSubject<QueryFormat>(this.queryFormat);

    //Suche anmelden: Bei Aenderungen des Suchfeld-BehaviorSubjekts searchTerms
    this.results = this.complexSearchTerms

      //TODO debounce + distinct
      //Term an Suchanfrage weiterleiten -> Ergebnis wird in Docs gespeichert
      .switchMap((query: QueryFormat) => this.solrSearchService.getSolrDataComplex(query))

    //Aenderungen bei results (=Solr-Suche-Anfrage) und Werte extrahieren
    this.results.subscribe(results => {

      //Array der Treffer-Dokumente
      this.docs = results.response.docs

      //Anzahl der Treffer
      this.count = results.response.numFound;

      //Solr-Facetten Werte
      this.facets = results.facet_counts.facet_fields;

      //Solr-Facetten-Ranges Werte
      this.ranges = results.facet_counts.facet_ranges;

      //Werte fuer nicht existirende Range-Werte (z.B. Eintraege ohne Jahr)
      this.rangeMissingValues = results.facet_counts.facet_queries;

      //Jahres-Chart erstellen
      this.createCharts();
    });

    //Reactive Forms fuer Suchfelder und Suche speichern
    this.createForms();

    //Query-Parameter aus URL auslesen
    this.route.queryParamMap.subscribe(params => {

      //Wenn Query-Parameter gesetzt ist
      if (params.get("query")) {

        //diesen zu queryFormat dekodieren
        this.queryFormat = JSON.parse(LZString.decompressFromEncodedURIComponent(params.get("query")));

        //Flag setzen, damit nicht Wert aus localstorage genommen wird
        this.loadFromLink = true;
      }
    });

    //Wenn keine Anfrage per Link geschickt wurde
    if (!this.loadFromLink) {

      //letzte Suche aus localstorage laden
      let localStorageUserQuery = localStorage.getItem("userQuery");

      //Wenn Suchanfrage aus localstorage geladen wurde
      if (localStorageUserQuery) {

        //Anfrage-Format laden
        this.queryFormat = JSON.parse(localStorageUserQuery);
      }
    }

    //Input-Felder in Template setzen
    this.setFormInputValues();

    //min- / max-Werte fuer Slider, Labels und Optionen fuer Chart setzen
    this.setRangeData();

    //Slider Werte setzen
    this.sliderInit();
  }

  //FormControls fuer Suchanfragen und Speicherung von Suchanfragen anlgen
  createForms(): any {

    //Such-Form
    this.searchForm = this._fb.group({

      //Anzahl der Zeilen in der Treffertabelle mit Wert aus queryFormat belegen
      rows: this.queryFormat.queryParams.rows,
    });

    //Wenn Anzahl der Zeilen in Treffertabelle geandert wird
    this.searchForm.controls["rows"].valueChanges.subscribe(rows => {

      //Zeilen-Anzahl in Abfrage-Format setzen
      this.queryFormat.queryParams.rows = rows;

      //Trefferliste wieder von vorne anzeigen
      this.queryFormat.queryParams.start = 0;

      //Suche starten
      this.complexSearchTerms.next(this.queryFormat);
    });

    //FormControls fuer Suchfelder und deren Auswahlselects festlegen
    for (let key of Object.keys(this.queryFormat.searchFields)) {

      //Select-Feld fuer Auswahl des Feldes (z.B. Freitext, Titel, Person,...)
      this.searchForm.addControl('selectSearchField_' + key, new FormControl(this.queryFormat.searchFields[key].field));

      //Bei Aenderung des Selects
      this.searchForm.controls['selectSearchField_' + key].valueChanges.subscribe(value => {

        //Wert in queryFormat speichern
        this.queryFormat.searchFields[key].field = value;

        //Suche starten
        this.complexSearchTerms.next(this.queryFormat);
      });

      //Suchfeld einfuegen
      this.searchForm.addControl('searchField_' + key, new FormControl());

      //Bei Aenderung des Suchfelds
      this.searchForm.controls['searchField_' + key].valueChanges.subscribe(value => {

        //Wert in Query-Format anpassen
        this.queryFormat.searchFields[key].value = value;

        //Start der Trefferliste auf Anfang setzen
        this.queryFormat.queryParams.start = 0;

        //Suche starten
        this.complexSearchTerms.next(this.queryFormat);
      });
    }

    //FormControls fuer Checkenboxen erstellen, die festlegen, ob Titel ohne ein Merkmal (z.B. Titel ohne Jahr) angezeigt werden sollen
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      //FormControl fuer Checkbox anlegen
      this.searchForm.addControl('showMissing_' + key, new FormControl());

      //Bei Aenderung der Checkbox
      this.searchForm.controls['showMissing_' + key].valueChanges.subscribe(checked => {

        //Wert setzen
        this.queryFormat.rangeFields[key].showMissingValues = checked;

        //Suche starten
        this.complexSearchTerms.next(this.queryFormat);
      });
    }

    //FormControls fuer Selects erstellen, die festlegen wie die Werte einer Facette kombiniert werden (ger and eng) vs (ger or eng)
    for (let key of Object.keys(this.queryFormat.facetFields)) {

      //FormControl nur erstellen, wenn es eine Auswahlmoeglichkeit gibt (OR, AND)
      if (this.queryFormat.facetFields[key].operators.length > 1) {

        //FormControl anlegen
        this.searchForm.addControl('operatorSelect_' + key, new FormControl(this.queryFormat.facetFields[key].operator));

        //Bei Anederung des Selects
        this.searchForm.controls['operatorSelect_' + key].valueChanges.subscribe(value => {

          //Wert in queryFormat speichern
          this.queryFormat.facetFields[key].operator = value;

          //Suche starten
          this.complexSearchTerms.next(this.queryFormat);
        })
      }
    }

    //Input fuer "Suche speichern". Name = Pflichtfeld und muss eindeutig sein, "Meine Suche2"
    this.saveQuery = new FormControl('Meine Suche ' + (this.savedQueries.length + 1), [Validators.required, Validators.minLength(3), uniqueQueryNameValidator(this.savedQueries)]);
  }

  //Facette speichern
  selectFacet(field, value) {

    //Facettenwert in Array speichern
    this.queryFormat.facetFields[field]["values"].push(value);

    //Start der Trefferliste auf Anfang setzen
    this.queryFormat.queryParams.start = 0;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Facette entfernen
  removeFacet(field, value) {

    //Index der ausgewaehlten Facette finden anhand des Namens
    let index = this.queryFormat.facetFields[field]["values"].indexOf(value);

    //TODO an Start der Trefferliste springen?

    //in Array loeschen
    this.queryFormat.facetFields[field]["values"].splice(index, 1);

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Suche zuruecksetzen
  resetSearch() {

    //Anfrage-Format leeren
    this.queryFormat = new QueryFormat();

    //Input-Felder in Template zureucksetzen
    this.setFormInputValues();

    //Ueber Slider gehen
    this.sliderElement.toArray().forEach((value, index) => {

      //Werte zuruecksetzen
      value.restore();
    })

    //Slider zuruecksetzen
    this.sliderInit();

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Detailinfo holen und Ansicht toggeln
  getFullData(id: number) {

    //Wenn es noch keine Detailinfos (abstract,...) dieser ID gibt
    if (this.detailDataArray[id] === undefined) {

      //Infos aus Solr holen und lokal speichern. Eintrag sichtbar machen
      this.solrSearchService.getSolrDetailData(id).subscribe(
        res => this.detailDataArray[id] = { "data": res, "visible": true });
    }

    //die Infos sind bereits lokal gespeichert
    else {

      //Sichtbarkeit toggeln
      this.detailDataArray[id]["visible"] = !this.detailDataArray[id]["visible"];
    }
  }

  //Werte des Abfrage-Formats in Input-Felder im Template schreiben
  setFormInputValues() {

    //aktuellen Startwert merken (dieser wird beim Setzen der Felder auf 0 gesetzt) und ganz am Ende setzen
    let start = this.queryFormat.queryParams.start;

    //Ueber Felder des Abfrage-Formats gehen
    for (let key of Object.keys(this.queryFormat.searchFields)) {

      //das ausgewaehlte Suchefeld in Template setzen (z.B. Freitext, Titel, Person,...)
      this.searchForm.get('selectSearchField_' + key).setValue(this.queryFormat.searchFields[key].field);

      //Wert in Input-Feld im Template setzen
      this.searchForm.get('searchField_' + key).setValue(this.queryFormat.searchFields[key].value)
    }

    //Operator bei Verknuepfung der Facettenwerte setzen
    for (let key of Object.keys(this.queryFormat.facetFields)) {

      //Es existiert nur dann ein FormControl, wenn es eine Auswahlmoeglichkeit gibt (OR, AND)
      if (this.queryFormat.facetFields[key].operators.length > 1) {

        //Wert aus QueryFormat holen und in Template setzen
        this.searchForm.get('operatorSelect_' + key).setValue(this.queryFormat.facetFields[key].operator);
      }
    }

    //Checkboxen anhaken, bei welchen Ranges auch Titel ohne Merkmal gesucht werden sollen (z.B. Titel ohne Jahr)
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      //Wert aus QueryFormat holen und in Template setzen
      this.searchForm.get("showMissing_" + key).setValue(this.queryFormat.rangeFields[key].showMissingValues);
    }

    //Anzahl der Treffer in Select im Template auswaehlen
    this.searchForm.get("rows").setValue(this.queryFormat.queryParams.rows);

    //gemerkten Startwert wieder setzen (war zwischenzeitlich auf 0 gesetzt worden)
    this.queryFormat.queryParams.start = start;
  }

  //Nutzeranfrage speichern
  saveUserQuery(name: string) {

    //deep copy von Anfrage-Format erstellen (nicht einfach Referenz zuordnen!)
    let qf = JSON.parse(JSON.stringify(this.queryFormat));

    //Name der gespeicherten Suchanfragen und Anfrage-Format in Objekt packen
    let userQuery = new SavedQueryFormat(name, qf);

    //Objekt in Array einfuegen
    this.savedQueries.push(userQuery);

    //Namensfeld fuer Nutzerabfrage mit Standard-Wert belegen ("Meine Suche2")
    this.saveQuery.setValue('Meine Suche ' + (this.savedQueries.length + 1));
  }

  //Nutzeranfrage laden
  loadUserQuery(index: number) {

    //Anfrage-Format an passender Stelle aus Array holen
    this.queryFormat = JSON.parse(JSON.stringify(this.savedQueries[index].query));

    //Werte in Input Feldern setzen
    this.setFormInputValues();

    //Slider-Werte setzen
    this.sliderInit();

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //gespeicherte Nutzeranfrage loeschen
  deleteUserQuery(index: number) {

    //Suchanfrage an passender Stelle loeschen
    this.savedQueries.splice(index, 1);
  }

  //Blaettern in Trefferliste
  updateStart(offset) {

    //neuen Startwert berechnen
    let newStart: number;

    //auf letzte Seite springen
    if (offset === 'last') {
      newStart = (this.queryFormat.queryParams.rows * (this.pages - 1));
    }

    //auf 1. Seite springen
    else if (offset === 'first') {
      newStart = 0;
    }

    //1 Schritt nach vorne oder hinten blaetten
    else {
      newStart = this.queryFormat.queryParams.start + (offset * this.queryFormat.queryParams.rows);
    }

    //Start anpassen
    this.queryFormat.queryParams.start = newStart;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Tabelle sortieren
  sortTable(sortField: string) {

    //wenn bereits nach diesem Feld sortiert wird
    if (sortField === this.queryFormat.queryParams.sortField) {

      //Sortierrichtung umdrehen
      this.queryFormat.queryParams.sortDir = this.queryFormat.queryParams.sortDir === "desc" ? "asc" : "desc";
    }

    //es wird derzeit nach einem anderen Feld sortiert
    else {

      //Sortierfeld setzen
      this.queryFormat.queryParams.sortField = sortField;

      //Sortierrichtung aufsteigend setzen
      this.queryFormat.queryParams.sortDir = 'asc';
    }

    //Trefferliste wieder von vorne anzeigen
    this.queryFormat.queryParams.start = 0;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //gibt eine CSS-Klasse zurueck, wenn nach dieser Spalte sortiert wird
  sortBy(field: string) {

    //wenn nach diesem Feld sortiert wird
    if (field === this.queryFormat.queryParams.sortField) {

      //anhander der gesetzten Sortierrichtung eine CSS-Klasse ausgeben
      return this.queryFormat.queryParams.sortDir === "asc" ? "sort_asc" : "sort_desc";
    }
  }

  //min- / max-Werte fuer Ranges setzen
  setRangeData() {

    //Ueber Felder des Abfrage-Formats gehen
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      //leeren Wert fuer rangeMissingValues anlegen (da sonst undefined)
      this.rangeMissingValues['{!ex=' + this.queryFormat.rangeFields[key].field + '}' + this.queryFormat.rangeFields[key].field + ':0'] = 0;

      //Objekt fuer diese Range (z.B. Jahr) anelegen
      this.rangeData[key] = {};

      //Min und Max-Werte aus Query-Format holen
      this.rangeData[key].min = this.queryFormat.rangeFields[key].min;
      this.rangeData[key].max = this.queryFormat.rangeFields[key].max;

      //Leeres Datenarray anlegen
      this.rangeData[key].chartData = [{ data: [] }];

      //Labels erstellen
      let labelArray = [];

      //von min zu max Wert gehen
      for (let i = this.rangeData[key].min; i <= this.rangeData[key].max; i++) {

        //Werte sammeln (1950, 1951,..., 2017)
        labelArray.push(i);
      }

      //Labels sind aber unsichtbar (werden aber fuer Hover benoetigt)
      this.rangeData[key].chartLabels = labelArray;

      //Prefix fuer Slider
      this.rangeData[key].label = this.queryFormat.rangeFields[key].label;

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
  createCharts() {

    //Chartdata erstellen
    for (let key of Object.keys(this.queryFormat.rangeFields)) {

      //Werte sammeln
      let barData = [];
      let solrData = this.ranges[this.queryFormat.rangeFields[key].field].counts;

      //Ranges kommen als Array von Arrays [["1800", 2]["1801", 0]["1802", 6],...],
      for (let i = 0; i < solrData.length; i++) {

        //nur den Zaehlwert speichern fuer Chart
        barData.push(solrData[i][1]);
      }

      //Daten fuer Chart speichern
      this.rangeData[key].chartData = [{ data: barData }];
    }
  }

  //Slider initialieiseren
  sliderInit(key?) {

    //Wenn key uebergeben wird, nur diesen bearbeiten, ansonsten alle keys
    let keys = key ? [key] : Object.keys(this.queryFormat.rangeFields)

    //Ueber Rangewerte gehen
    for (let key of keys) {

      //Von und bis Werte fuer Slider setzen
      this.rangeData[key].from = this.queryFormat.rangeFields[key].from;
      this.rangeData[key].to = this.queryFormat.rangeFields[key].to;

      //Vorhangwerte setzen
      this.rangeData[key].curtainLeft = ((1 - (this.rangeData[key].max - this.rangeData[key].from) / (this.rangeData[key].max - this.rangeData[key].min)) * 100) + '%';
      this.rangeData[key].curtainRight = ((this.rangeData[key].max - this.rangeData[key].to) / (this.rangeData[key].max - this.rangeData[key].min) * 100) + '%';
    }
  }

  //Beim Ziehen des Sliders
  updateSlider($event, key) {

    //Vorhangswerte setzen
    this.rangeData[key].curtainLeft = $event.from_percent + '%';
    this.rangeData[key].curtainRight = (100 - $event.to_percent) + '%';

    //fq-Werte setzen
    this.queryFormat.rangeFields[key].from = $event.from;
    this.queryFormat.rangeFields[key].to = $event.to;

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Anzahl der Eintraege ohne ein Merkmal (z.B. Titel ohne Jahr)
  getMissingCount(key) {

    //lokal gespeicherten Wert zurueckliefern
    return this.rangeMissingValues['{!ex=' + this.queryFormat.rangeFields[key].field + '}' + this.queryFormat.rangeFields[key].field + ':0'];
  }

  //Slider auf Anfangswerte zuruecksetzen
  resetRange(key) {

    //Wert in Queryformat anpassen
    this.queryFormat.rangeFields[key].from = this.queryFormat.rangeFields[key].min;
    this.queryFormat.rangeFields[key].to = this.queryFormat.rangeFields[key].max;

    this.sliderInit(key);

    //Suche starten
    this.complexSearchTerms.next(this.queryFormat);
  }

  //Werte wie aktuelle Anfrage oder gespeicherte Anfragen in den localstroage schreiben (z.B. wenn Seite verlassen wird)
  writeToLocalStorage() {

    //aktuelle UserQuery speichern
    localStorage.setItem("userQuery", JSON.stringify(this.queryFormat));

    //Liste der gespeicherten UserQueries speichern
    localStorage.setItem("savedUserQueries", JSON.stringify(this.savedQueries));
  }

  //Link einer Nutzeranfrage erstellen
  getQueryLink(queryFormat: QueryFormat): string {

    //String aus JSON erstellen
    let jsonString = JSON.stringify(queryFormat);

    //String komprimieren
    let lzString = LZString.compressToEncodedURIComponent(jsonString);

    return "localhost:4200/search?query=" + lzString;
  }
}

//TODO kann Suche immer angestossen werden, wenn Wert in queryFormat angepasst wird? -> Fkt.
//TODO rowOpts, searchFields, Facettenlabel und Operator configurierbar
//TODO pagination richtig berechnet? 10 Treffer bei Auswahl 5 pro Seite

//TODO Merkliste
//TODO Slider / Chart
//TODO Wenn keine Suchefelder gewaehlt -> *:* Suche