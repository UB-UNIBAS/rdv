import { Injectable } from '@angular/core';
import { Http } from "@angular/http";

import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { QueryFormat } from "app/query-format";

@Injectable()
export class SolrSearchService {

  //Solr-Suche, Basis-URL
  private url = `
/solr/freidok_core/
select?wt=json
&indent=true
&facet=true
&facet.mincount=1
&json.nl=arrarr`;

  //Http Service injekten
  constructor(private http: Http) { }

  //Daten in Solr suchen
  getSolrDataComplex(queryFormat: QueryFormat): Observable<any> {

    //Basis-URL nehmen und mit Anfragen erweitern
    let queryUrl = this.url;

    //Suchanfrage zusammenbauen
    let queryArray = [];

    //Ueber Anfrage-Formate gehen
    for (let key of Object.keys(queryFormat.searchFields)) {

      //Schnellzugriff auf dieses Suchfeld
      let searchfield_data = queryFormat.searchFields[key];

      //Wenn Wert gesetzt ist (z.B. bei all fuer all_text-Suche)
      if (searchfield_data.value) {

        //Anfrage fuer dieses Feld speichern
        queryArray.push(searchfield_data.field + ":(" + searchfield_data.value + "*)");
      }
    }

    //Sucheanfragen aus Anfragen der Einzelfelder zusammenbauen oder *:* Abfrage, wenn Felder leer
    let query = queryArray.length ? "&q=" + queryArray.join(" ") : "&q=*:*";

    //FilterQuery-Anfrage zusammenbauen
    let fqArray = [];

    //Ueber Facettenfelder gehen
    for (let key of Object.keys(queryFormat.facetFields)) {

      //Schnellzugriff auf Infos dieser Facette
      let facet_data = queryFormat.facetFields[key];

      //Bei AND Verknuepfung innerhalb einer Facette keine Extra-Behandlung, bei OR-Verknuepfung muss sichergestellt sein, dass andere Werte auch sichtbar sind (Auswahl ger -> auch Facettenwert eng anzeigen fuer ger OR eng)
      let extra_tag = facet_data.operator === "AND" ? ["", ""] : ["{!ex=" + facet_data.field + "}", "{!tag=" + facet_data.field + "}"];

      //Feld als Solr-Facette in URL anmelden (damit ueberhaupt Daten geliefert werden)
      queryUrl += "&facet.field=" + extra_tag[0] + facet_data.field;

      //Wenn es Werte bei einem Facettenfeld gibt (z.B. bei language fuer language_all_facet)
      if (facet_data.values.length) {

        //Einzelwerte dieser Facette operator (OR vs. AND) verknuepfen (ger OR eng) und in Array sammeln
        fqArray.push("&fq=" + extra_tag[1] + facet_data.field + ":(" + facet_data.values.join(" " + facet_data.operator + " ") + ")");
      }
    }

    //FilterQuery aus einzelnen Filterqueries zusammenbauen oder leer, wenn keine Facetten ausgewaehlt sind
    let fq = fqArray.length ? fqArray.join("") : "";

    //FilterQuery-Array fuer Range-Anfragen
    let fqRangeArray = [];

    //Ueber Rangefelder gehen
    for (let key of Object.keys(queryFormat.rangeFields)) {

      //Schnellzugriff auf Infos dieser Range
      let range_data = queryFormat.rangeFields[key];

      //Feld als Solr-Facette in URL anmelden und Range-Optionen aktivieren
      queryUrl += "&facet.query={!ex=" + range_data.field + "}" + range_data.field + ":0";
      queryUrl += "&facet.range={!ex=" + range_data.field + "}" + range_data.field;
      queryUrl += "&f." + range_data.field + ".facet.range.start=" + range_data.min;
      queryUrl += "&f." + range_data.field + ".facet.range.end=" + range_data.max;
      queryUrl += "&f." + range_data.field + ".facet.range.gap=1";
      queryUrl += "&f." + range_data.field + ".facet.mincount=0";

      //Range-Anfrage
      let range_query = "&fq={!tag=" + range_data.field + "}" + range_data.field + ":[" + range_data.from + " TO " + range_data.to + "]"

      //ggf. Treffer ohne Wert dieser Range (z.B. ohne Jahr) einfuegen
      range_query += range_data.showMissingValues ? " OR " + range_data.field + ":0" : "";

      //alle Rangequeries in Array sammeln
      fqRangeArray.push(range_query)
    }

    //Range-Filterquery aus einzelnen Anfragen zusammenbauen oder leer
    let fq_range = fqRangeArray.length ? fqRangeArray.join("") : "";

    //Suchanfrage zusammenbauen, dabei auch Anzahl der Treffer setzen
    queryUrl += query + fq + fq_range
      + "&rows=" + queryFormat.queryParams.rows
      + "&start=" + queryFormat.queryParams.start
      + "&sort=" + queryFormat.queryParams.sortField + " " + queryFormat.queryParams.sortDir
      + "&fl=" + queryFormat.queryParams.fl.join(",");

    //console.log(queryUrl);

    //HTTP-Anfrage an Solr
    return this.http

      //GET Anfrage mit URL Anfrage und Trunkierung
      .get(queryUrl)

      //von JSON-Antwort nur die Dokument weiterreichen
      .map(response => response.json() as any);
  }

  //Detail-Daten aus Solr holen (abstract,...)
  getSolrDetailData(id: number): Observable<any> {

    //Suchanfrage zusammenbauen, dabei auch Anzahl der Treffer setzen
    let queryUrl = this.url + "&q=id:" + id + "&fl=keyword_all_string, source_title_all_string"
    //console.log(queryUrl);

    //HTTP-Anfrage an Solr
    return this.http

      //GET Anfrage mit URL Anfrage und Trunkierung
      .get(queryUrl)

      //von JSON-Antwort nur die Dokument weiterreichen
      .map(response => response.json().response.docs[0] as any);
  }
}