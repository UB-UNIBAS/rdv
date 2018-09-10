import { MainConfig } from 'app/config/main-config-elastic';

import { Injectable } from '@angular/core';
// FIXME: Replace HttpModule with HttpClient
import { Http } from '@angular/http';
import { QueryFormat } from 'app/config/query-format';

@Injectable()
export class UserConfigService {

  //MainConfig erstellen (z.B. Felder der Treffer liste)
  config: MainConfig = new MainConfig();

  //Http-Service laden
  constructor(private http: Http) {
  }

  //Config an Anwendung ausliefern
  async getConfig(): Promise<MainConfig> {

    // falls ein tableField extraInfo gesetzt hat, generatedConfig['tableFieldsDisplayExtraInfo'] auf true setzen
    this.config.generatedConfig['tableFieldsDisplayExtraInfo'] = false;
    for (const field of this.config.tableFields) {
      if (field.hasOwnProperty('extraInfo') && field["extraInfo"] === true) {
        this.config.generatedConfig['tableFieldsDisplayExtraInfo'] = true;
        break;
      }
    }

    // falls ein tableField landingpage gesetzt hat, generatedConfig['tableFieldsDisplayLandingpage'] auf true setzen
    this.config.generatedConfig['tableFieldsDisplayLandingpage'] = false;
    for (const field of this.config.tableFields) {
      if (field.hasOwnProperty('landingpage') && field["landingpage"] === true) {
        this.config.generatedConfig['tableFieldsDisplayLandingpage'] = true;
        break;
      }
    }

    //vorhandene Filter dynamisch laden
    for (const key of Object.keys(this.config.filterFields)) {

      //Wenn bei Filter eine URL hinterlegt ist, muessen Optionen dynamisch geholt werden
      if (this.config.filterFields[key].url) {

        //Optionen per URL holen
        this.config = await this.http.get(this.config.filterFields[key].url).toPromise().then(response => {

          //Filter-Auswaehlmoeglichkeiten in Filterdatenbereich der Config schreiben (war bisher leer)
          this.config.filterFields[key].options = response.json();

          //Config zurueckgeben
          return this.config;
        });
      }
    }

    //ggf. angepasste Config an Anwendung geben
    return this.config;
  }

  //QueryFormat aus Config erstellen
  getQueryFormat(): QueryFormat {

    //Neues QueryFormat-Geruest erstellen
    const queryFormat = new QueryFormat();

    //Ueber Suchfelder in der Config gehen
    this.config.searchFields.preselect.forEach((option, index) => {

      //Suchfeld search1, search2,... anlegen
      queryFormat.searchFields["search" + (index + 1)] = {
        "field": option,
        "value": ""
      }
    });

    //Ueber Fitlerfelder in der Config gehen
    for (const key of Object.keys(this.config.filterFields)) {

      //Filter anlegen in QueryFormat
      queryFormat.filterFields[key] = {
        "field": this.config.filterFields[key].field,
        "values": []
      }
    }

    //Ueber Facettenfelder in der Config gehen
    for (const key of Object.keys(this.config.facetFields)) {

      //Facette anlegen in QueryFormat
      queryFormat.facetFields[key] = {
        "field": this.config.facetFields[key].field,
        "values": [],
        "operator": this.config.facetFields[key].operator
      }
    }

    //Ueber Rangefelder in der Config gehen
    for (const key of Object.keys(this.config.rangeFields)) {

      //Range anlegen in QueryFormat
      queryFormat.rangeFields[key] = {
        "field": this.config.rangeFields[key].field,
        "min": this.config.rangeFields[key].min,
        "from": this.config.rangeFields[key].from,
        "to": this.config.rangeFields[key].to,
        "max": this.config.rangeFields[key].max,
        "showMissingValues": this.config.rangeFields[key].showMissingValues
      }
    }

    //QueryParams aus Config laden (z.B. rows, start, sort,...)
    queryFormat.queryParams = this.config.queryParams;

    //QueryFormat zurueckgeben
    return queryFormat;
  }
}
