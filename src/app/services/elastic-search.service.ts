//Config anpassen
import { MainConfig } from "app/config/main-config-elastic";

import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { QueryFormat } from "app/config/query-format";
import { BasketFormat } from 'app/config/basket-format';

@Injectable()
export class BackendSearchService {

  //URL auf PHP-Proxy
  private proxyUrl: string;

  //Felder, die bei normaler Suche fuer die Treffertabelle geholt werden
  tableFields: string[] = [];

  //Felder, die bei der Detailsuche geholt werden
  detailFields: string[] = [];

  //Http Service injekten
  constructor(private http: Http) {

    //Main-Config laden
    let mainConfig = new MainConfig();

    //proxyUrl setzen
    this.proxyUrl = mainConfig.proxyUrl;

    //Felder sammeln, die bei normaler Suche geholt werden sollen
    for (let field of mainConfig.tableFields) {

      //ID Feld kommt sowieso (allerdings als _id und nicht als id in _source), daher id nicht in Liste der geholten Felder einfuegen
      if (field.field !== "id") {

        //Feld-Namen in tempArray sammeln
        this.tableFields.push(field.field);
      }
    }

    //Felder sammeln, die bei Detailsuche geholt werden sollen
    for (let key of Object.keys(mainConfig.extraInfos)) {

      //Feld-Namen in tempArray sammeln
      this.detailFields.push(mainConfig.extraInfos[key].field);
    }
  }

  //Daten in Elasticsearch suchen
  getBackendDataComplex(queryFormat: QueryFormat): Observable<any> {

    //Anfrageobjekt erzeugen
    let complexQueryFormat = {};

    //Suchparameter fuer Paging und Sortierung direkt aus Queryformat uebernehmen
    complexQueryFormat['queryParams'] = queryFormat.queryParams;

    //Ueber Anfrage-Formate gehen
    for (let key of Object.keys(queryFormat.searchFields)) {

      //Schnellzugriff auf dieses Suchfeld
      let searchfield_data = queryFormat.searchFields[key];

      //Wenn Wert gesetzt ist (z.B. bei der Titel-Suche)
      if (searchfield_data.value.trim()) {

        //Wenn query-Bereich noch nicht angelegt wurde
        if (complexQueryFormat["query"] === undefined) {

          //Geruest einer Boolquery aufbauen (Titel:Freiheit AND Person:Martin He*), einzelne Suchfelder werden per AND verknuepft
          complexQueryFormat["query"] = {
            "bool": {
              "must": []
            }
          };
        }

        //Wildcard query_string-Suche aufbauen mit Trunkierung rechts
        let queryString = {
          "query_string": {
            "query": searchfield_data.value.trim() + "*",
            "default_operator": "AND"
          }
        };

        //Wenn nicht in Freitext gesucht wird
        if (searchfield_data.field !== "all_text") {

          //Passendes Suchfeld setzen
          queryString["query_string"]["fields"] = [searchfield_data.field]
        }

        //Bool-Queries sammeln
        complexQueryFormat["query"]["bool"]["must"].push(queryString);
      }
    }

    //Wenn es keine komplexe Suche gibt (also keine Werte in den Suchfeldern stehen)
    if (complexQueryFormat["query"] === undefined) {

      //match_all = *:* Anfrage-Parameter setzen fuer proxy
      complexQueryFormat["match_all"] = true;
    }

    //Ueber Filterfelder gehen
    for (let key of Object.keys(queryFormat.filterFields)) {

      //Schnellzugriff auf Infos dieses Filters
      let filterData = queryFormat.filterFields[key];

      //Ueber ausgewaehlte Filterwerte dieses Filters gehen (["Artikel", "Buch"] bei Filter "Typ")
      filterData.values.forEach((item, index) => {

        //Zu Beginn gibt es noch keinen Filterbereich -> anlegen       
        if (complexQueryFormat["filter"] === undefined) {

          //Filterbereich mit must-clause-Array (AND-Verknuepfung) anlegen. Must query kombiniert die einzelnen Filter per AND. Die einzelnen Werte eines Filters sind dann per OR verknuepft: type:Artikel AND ort:(Berlin OR Bremen)
          complexQueryFormat["filter"] = {
            "bool": {
              "must": []
            }
          };
        }

        //Bei 1. Filterwert ("Aritkel") dieses Filters ("Dokumentyp")
        if (index === 0) {

          //should-clause (=OR-Verknuepfung) anlegen fuer diesen Filter (Artikel OR Buch)
          complexQueryFormat["filter"]["bool"]["must"].push({ "bool": { "should": [] } });
        }

        //passenden Index im must-Array finden = letzter Eintrag
        let mustIndex = complexQueryFormat["filter"]["bool"]["must"].length - 1;

        //Filterwert in should-clause dieses Filteres einfuegen als term-query (exakter Treffer auf keyword-type)
        complexQueryFormat["filter"]["bool"]["must"][mustIndex]["bool"]["should"].push({ "term": { [filterData.field]: item } });
      });
    }

    //Ueber Facettenfelder gehen
    for (let key of Object.keys(queryFormat.facetFields)) {

      //Schnellzugriff auf Infos dieser Facette
      let facet_data = queryFormat.facetFields[key];

      //Bei AND Verknuepfung innerhalb einer Facette keine Extra-Behandlung, bei OR-Verknuepfung muss sichergestellt sein, dass andere Werte auch sichtbar sind (Auswahl ger -> auch Facettenwert eng anzeigen fuer ger OR eng)
      let extra_tag = facet_data.operator === "AND" ? ["", ""] : ["{!ex=" + facet_data.field + "}", "{!tag=" + facet_data.field + "}"];

      //Feld als Solr-Facette in URL anmelden (damit ueberhaupt Daten geliefert werden), # wird von PHP wieder zu . umgewandelt
      //myParams.append("facet#field[]", (extra_tag[0] + facet_data.field));

      //Wenn es Werte bei einem Facettenfeld gibt (z.B. bei language fuer language_all_facet)
      if (facet_data.values.length) {

        //Einzelwerte dieser Facette operator (OR vs. AND) verknuepfen (ger OR eng) und in Array sammeln
        //myParams.append("fq[]", encodeURI(extra_tag[1] + facet_data.field + ":(" + facet_data.values.join(" " + facet_data.operator + " ") + ")"));
      }
    }

    //Ueber Rangefelder gehen
    for (let key of Object.keys(queryFormat.rangeFields)) {

      //Schnellzugriff auf Infos dieser Range
      let range_data = queryFormat.rangeFields[key];

      //Feld als Solr-Facette in URL anmelden und Range-Optionen aktivieren, # wird von PHP wieder zu . umgewandelt
      //myParams.append("facet#query[]", "{!ex=" + range_data.field + "}" + range_data.field + ":0");
      //myParams.append("facet#range[]", "{!ex=" + range_data.field + "}" + range_data.field);
      //myParams.append("f#" + range_data.field + "#facet#range#start", range_data.min);
      //myParams.append("f#" + range_data.field + "#facet#range#end", range_data.max + 1);
      //myParams.append("f#" + range_data.field + "#facet#range#gap", "1");
      //myParams.append("f#" + range_data.field + "#facet#mincount", "0");

      //Range-Anfrage
      let range_query = "{!tag=" + range_data.field + "}" + range_data.field + ":[" + range_data.from + " TO " + range_data.to + "]"

      //ggf. Treffer ohne Wert dieser Range (z.B. ohne Jahr) einfuegen
      range_query += range_data.showMissingValues ? " OR " + range_data.field + ":0" : "";
      //myParams.append("fq[]", encodeURI(range_query));
    }

    //Liste der zu holenden Tabellenfelder
    complexQueryFormat['sourceFields'] = this.tableFields;
    console.log(JSON.stringify(complexQueryFormat));

    //HTTP-Anfrage an Elasticsearch
    return this.http

      //POST Anfrage
      .post(this.proxyUrl, JSON.stringify(complexQueryFormat))

      //Antwort als JSON weiterreichen
      .map(response => response.json() as any);
  }

  //Detail-Daten aus Elasticsearch fuer zusaetzliche Zeile holen (abstract,...)
  getBackendDetailData(id: string): Observable<any> {

    //Objekt fuer Detailsuche
    let detailQueryFormat = {};

    //ID-Suche (nach 1 ID)
    detailQueryFormat["ids"] = [id];

    //Liste der zu holenenden Felder
    detailQueryFormat["sourceFields"] = this.detailFields;
    //console.log(JSON.stringify(detailQueryFormat));

    //HTTP-Anfrage an Elasticsearch
    return this.http

      //POST-Anfrage mit URL, ID und sourceFields
      .post(this.proxyUrl, JSON.stringify(detailQueryFormat))

      //das 1. Dokument als JSON weiterreichen
      .map(response => response.json().response.docs[0] as any);
  }

  //Merklisten-Daten in Elasticsearch suchen (ueber IDs)
  getBackendDataBasket(basket: BasketFormat): Observable<any> {

    //Anfrage-Objekt erstellen
    let basketQueryFormat = {}

    //Parameter fuer Paging und Sortierung direkt vom Merklisten-Objekt uebernehmen
    basketQueryFormat["queryParams"] = basket.queryParams;

    //zu suchende IDs on Merklisten-Objekt uebernehmen
    basketQueryFormat["ids"] = basket.ids;

    //Liste der Tabellenfelder mitgeben
    basketQueryFormat['sourceFields'] = this.tableFields;
    //console.log(JSON.stringify(basketQueryFormat));

    //HTTP-Anfrage an Elasticsearch
    return this.http

      //POST Anfrage mit URL, Liste der IDs und Liste der Felder
      .post(this.proxyUrl, JSON.stringify(basketQueryFormat))

      //von JSON-Antwort nur die Dokument weiterreichen
      .map(response => response.json() as any);
  }

}