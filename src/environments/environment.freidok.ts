export const environment = {

  production: false,

  backend: "solr",

  // unter welcher Domaine (und Verzeichnis) läuft der RDV (wird benutzt um Links zu generieren)
  baseUrl: "http://localhost:4200",

  //Wo liegt Proxy-Skript, das mit Solr spricht?
  proxyUrl: "http://localhost/mh1018/test/php/solr/angularx_solr_proxy_freidok.php",

  //Welche Felder sind durchsuchbar, Anzahl der Felder in preselect regelt wie viele Suchfelder erscheinen
  searchFields: {
    "options": {
      "all_text": "Freitext",
      "ti_all_text": "Titel",
      "person_all_text": "Person"
    },
    "preselect": ["all_text", "ti_all_text", "person_all_text"]
  },

  //Infos zu Filtern (z.B. Filterung nach Einrichtung)
  filterFields: {},

  //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
  //order gilt fuer Facetten und Ranges
  facetFields: {
    "language": {
      "field": "language_all_facet",
      "label": "Sprache",
      "operators": ["OR", "AND"],
      "operator": "AND",
      "order": 1
    },
    "doctype": {
      "field": "doctype_string",
      "label": "Dokumenttyp",
      "operators": ["OR"],
      "operator": "OR",
      "order": 3
    }
  },

  //Infos zu Ranges (z.B. Label)
  //order gilt fuer Facetten und Ranges
  rangeFields: {
    "year": {
      "field": "py_int",
      "label": "Jahr",
      "order": 2,
      "min": 1950,
      "from": 1950,
      "to": 2017,
      "max": 2017,
      "showMissingValues": true

    },
    "pages": {
      "field": "pages_int",
      "label": "Seitenzahl",
      "order": 4,
      "min": 1,
      "from": 1,
      "to": 20,
      "max": 20,
      "showMissingValues": true
    }
  },

//Optionen fuer Anzahl der Treffer Treffertabelle
  rowOpts: [5, 10, 20, 50],

  queryParams: {
    "rows": 10, // 5, 10, 20, 50
    "start": 0,
    "sortField": "id_int",
    "sortDir": "asc"
  },

  //Config fuer Merkliste
  basketConfig: {
    "queryParams": {
      "rows": 10,
      "sortField": "id_int",
      "sortDir": "asc"
    }
  },

  showExportList: {
    "basket": true,
    "table": true
  },

  //Tabellenspalten mit Sortierkriterium (Solr-Feld oder false)
  tableFields: [
    {
      "field": "id",
      "label": "ID",
      "sort": "id_int",
      "css": "col-sm-2 col-lg-1 flex-sm-column align-items-center text-sm-center",
      "extraInfo": true,
      "landingpage": true,
    },
    {
      "field": "person_all_string",
      "label": "Person",
      "sort": "person_sort_string",
      "css": "col-sm-3 col-lg-4 text-left",
    },
    {
      "field": "ti_all_string",
      "label": "Titel",
      "sort": "ti_sort_string",
      "css": "col-sm-4 col-lg-5 text-left",
    },
    {
      "field": "py_string",
      "label": "Jahr",
      "sort": "py_string",
      "css": "col-sm-2 col-lg-1 text-sm-center",
    }
  ],

  //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
  extraInfos: {
    "keywords": {
      "field": "keyword_all_string",
      "label": "Schlagwörter",
      "display": "text"
    },
    "source": {
      "field": "source_title_all_string",
      "label": "Quelle",
      "display": "text"
    }
  },
};
