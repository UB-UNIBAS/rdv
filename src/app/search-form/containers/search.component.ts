import { environment } from '../../../environments/environment';

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { FormBuilder } from "@angular/forms";
import { BasketsStoreService } from 'app/search-form/services/baskets-store.service';
import { UserConfigService } from 'app/services/user-config.service';
import { ActivatedRoute } from '@angular/router';
import { BackendSearchService } from '../../services/backend-search.service';
import { UpdateQueryService } from '../services/update-query.service';
import { QueriesService } from '../services/queries.service';
import { FormService } from '../services/form.service';
import { QueriesStoreService } from '../services/queries-store.service';
import { BasketsService } from '../services/baskets.service';
import { Basket } from '../models/basket';
import { SliderService } from '../services/slider.service';

//Komprimierung von Link-Anfragen (Suchanfragen, Merklisten)
declare var LZString: any;


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: [`
    .mh-lh {
      line-height: 30px
    }

    .query-overview label {
      width: 140px;
    }

    label {
      margin-bottom: 0;
    }
  `],
})

export class SearchComponent implements OnInit, OnDestroy {

  //Config-Objekt (z.B. Felder der Trefferliste)
  mainConfig = {
    ...environment,
    generatedConfig: {}
  };

  //Infos aus Link laden, verhindern, dass Link-Query von localStorage ueberschrieben wird
  private loadFromLink = false;
  private basketFromLinkData = "";
  private activeBasket: Basket;
  private indexOfActiveBasket: number;

  constructor(private backendSearchService: BackendSearchService,
              public updateQueryService: UpdateQueryService,
              private queriesService: QueriesService,
              private queriesStoreService: QueriesStoreService,
              public formService: FormService,
              private basketsStoreService: BasketsStoreService,
              private basketsService: BasketsService,
              private sliderService: SliderService,
              private _fb: FormBuilder,
              private route: ActivatedRoute,
              private userConfigService: UserConfigService) {
    userConfigService.getConfig();
    userConfigService.config$.subscribe(res => this.mainConfig = res);
    this.basketsService.activeBasket$.subscribe(res => this.activeBasket = res);
    this.basketsService.indexOfActiveBasket$.subscribe(res => this.indexOfActiveBasket = res);
  }

  //Bevor die Seite verlassen wird (z.B. F5 druecken)
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander() {

    //Werte in Localstorage speichern, damit sie beim Zurueckkehren wieder da sind
    this.writeToLocalStorage();
  }

  ngOnDestroy(): void {
    this.writeToLocalStorage();
  }

  ngOnInit() {

    this.updateQueryService.getData();

    //Query-Parameter aus URL auslesen
    this.route.queryParamMap.subscribe(params => {

      //Wenn Query-Parameter gesetzt ist (?search=dfewjSDFjklh)
      if (params.get("search")) {

        //diesen zu queryFormat dekodieren
        this.updateQueryService.queryFormat = JSON.parse(LZString.decompressFromEncodedURIComponent(params.get("search")));

        //Flag setzen, damit nicht Wert aus localstorage genommen wird
        this.loadFromLink = true;
      }

      //Wenn Merklisten-Parameter gesetzt ist (?basket=WEdszuig)
      if (params.get("basket")) {
        this.basketFromLinkData = params.get("basket");
      }
    });

    //Wenn keine Anfrage per Link geschickt wurde
    if (!this.loadFromLink) {

      //versuchen letzte Suche aus localstorage zu laden
      const localStorageUserQuery = localStorage.getItem("userQuery");

      //Wenn Suchanfrage aus localstorage geladen werden konnte
      if (localStorageUserQuery) {

        //Anfrage-Format laden
        this.updateQueryService.queryFormat = JSON.parse(localStorageUserQuery);
      }
    }

    //gespeicherte Suchanfragen aus localstorage laden -> vor Form-Erstellung, damit diese queries fuer den Validator genutzt werden koennen
    const localStorageSavedUserQueries = localStorage.getItem("savedUserQueries");

    //wenn gespeicherte Suchen aus localstorage geladen wurden
    if (localStorageSavedUserQueries) {

      //gespeicherte Suchen aus localstorage holen
      this.queriesStoreService.savedQueries = JSON.parse(localStorageSavedUserQueries);
    }

    //versuchen gespeicherte Merklisten aus localstorage zu laden -> nach Form-Erstellung
    const localStorageSavedUserBaskets = localStorage.getItem("savedBaskets");

    //wenn es ein Merklisten-Merkmal im localstorage gibt
    if (localStorageSavedUserBaskets) {

      //Wenn es Merklisten im localstorage gibt (kein leeres Array)
      if (JSON.parse(localStorageSavedUserBaskets).length) {

        //gespeicherte Suchen aus localstorage holen
        const lsBaskets = JSON.parse(localStorageSavedUserBaskets);

        //Ueber gespeicherte Merklisten gehen
        for (const lsBasket of lsBaskets) {

          //damit Merkliste anlegen
          this.basketsService.createBasket(true, lsBasket);
        }
      }
    }

    if (this.basketFromLinkData !== "") {

      //diesen dekodieren
      const basketFromLink = JSON.parse(LZString.decompressFromEncodedURIComponent(this.basketFromLinkData));

      //daraus Merkliste erstellen
      this.basketsService.createBasket(true, basketFromLink);
    }

    //Merkliste anlegen (falls keine aus localstorage geladen wurden oder per Link importiert wurde)
    if (!this.basketsService.basketsExist()) {

      //Leere Merkliste anlegen
      this.basketsService.createBasket(true);
    }

    //Suche starten
    this.updateQueryService.getData();
  }

  resetSearch() {

    //Anfrage-Format neu erzeugen lassen
    this.updateQueryService.queryFormat = this.userConfigService.getQueryFormat();

    //Input-Felder in Template zureucksetzen
    this.formService.setFormInputValues();

    this.sliderService.resetSlider();

    //Suche starten
    this.updateQueryService.getData();
  }

  //Werte wie aktuelle Anfrage oder gespeicherte Anfragen in den localstroage schreiben (z.B. wenn Seite verlassen wird)
  private writeToLocalStorage() {

    //aktuelle UserQuery speichern
    localStorage.setItem("userQuery", JSON.stringify(this.updateQueryService.queryFormat));

    //Array der gespeicherten UserQueries speichern
    localStorage.setItem("savedUserQueries", JSON.stringify(this.queriesStoreService.savedQueries));

    //Array der Merklisten speichern
    localStorage.setItem("savedBaskets", JSON.stringify(this.basketsStoreService.savedBasketItems));
  }

}

//Bug: Enter in Suchfeld

//TODO kann Suche immer angestossen werden, wenn Wert in queryFormat angepasst wird? -> Fkt. / Service
//TODO Slider / Chart
//TODO elasticsearch vs. solr-service -> data-service mit useconfig
//TODO i18n AND OR -> UND / ODER
//TODO Baum-Suche
//TODO Merklisten / Anfragen umsortieren
//TODO Aufteilung in einzelne Komponenten

//Bereiche ein- / ausblenden

//TODO debounce + distinct bei Suchanfrage
//TODO style zu CSS umarbeiten
//TODO Merklisten Export
//TODO Trefferliste pills / paging mit position absolute
//Mehrfach-Abfrage verhindern bei Laden einer Query  this.term.setValue(choice, {emitEvent: false});
//We write the choice in the term to see it in the input
//Filters als property (FormGroup)
//mehrere Felder für Sortierung
//Filter in Uebersicht oben anzeigen
//Overflow bei Facetten scroll-y
