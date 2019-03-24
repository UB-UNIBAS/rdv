export const environment = {

  production: false,

  backend: "solr",

  // unter welcher Domaine (und Verzeichnis) läuft der RDV (wird benutzt um Links zu generieren)
  baseUrl: "https://bwsciencetoshare.ub.uni-freiburg.de",

  //Wo liegt Proxy-Skript, das mit Solr spricht?
  proxyUrl: "https://bwsciencetoshare.ub.uni-freiburg.de/angularx_solr_proxy.php",

  //Welche Felder sind durchsuchbar, Anzahl der Felder in preselect regelt wie viele Suchfelder erscheinen
  searchFields: {
    "options": {
      "all_text": "Freitext",
      "ti_all_text": "Titel",
    },
    "preselect": ["all_text", "ti_all_text"]
  },

  //BWSTS-Filter
  filterFields: {
    "institution": {
      "label": "Einrichtung",
      "field": "mode_all_facet",
      "url": "https://bwsciencetoshare.ub.uni-freiburg.de/export.php",
      "options": []
    }
  },

  //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
  //order gilt fuer Facetten und Ranges
  facetFields: {},

  //Infos zu Ranges (z.B. Label)
  //order gilt fuer Facetten und Ranges
  rangeFields: {
    "year": {
      "field": "py_int",
      "label": "Jahr",
      "order": 1,
      "min": 1950,
      "from": 1950,
      "to": 2018,
      "max": 2018,
      "showMissingValues": true
    }
  },

//Optionen fuer Anzahl der Treffer Treffertabelle
  rowOpts: [5, 10, 20, 50],

  queryParams: {
    "rows": 20, // 5, 10, 20, 50
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
      "field": "id_int",
      "label": "ID",
      "sort": "id_int",
      "css": "col-sm-2 col-lg-2 flex-sm-column align-items-center text-sm-center",
      "extraInfo": true,
      "landingpage": false,
    },
    {
      "field": "rdvname_string",
      "label": "Repo",
      "sort": "rdvname_string",
      "css": "col-sm-2 col-lg-2 text-left",
    },
    {
      "field": "person_all_string",
      "label": "Person",
      "sort": "person_sort_string",
      "css": "col-sm-2 col-lg-2 text-left",
    },
    {
      "field": "ti_all_string",
      "label": "Titel",
      "sort": "ti_sort_string",
      "css": "col-sm-3 col-lg-4 text-left",
    },
    {
      "field": "py_int",
      "label": "Jahr",
      "sort": "py_int",
      "css": "col-sm-2 col-lg-1 text-sm-center",
    }
  ],

  //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
  extraInfos: {
    "id": {
      "field": "id",
      "label": "vollständige ID",
      "display": "text"
    },
    "doi": {
      "field": "doi_string",
      "label": "DOI",
      "display": "text"
    },
    "language": {
      "field": "language_string",
      "label": "Sprache",
      "display": "text"
    },
    "publisher": {
      "field": "publisher_string",
      "label": "Verlag",
      "display": "text"
    },
    "place": {
      "field": "place_string",
      "label": "Verlagsort",
      "display": "text"
    },
    "abstract": {
      "field": "abstract_string",
      "label": "Zusammenfassung",
      "display": "text"
    },
    "edition": {
      "field": "edition_string",
      "label": "Ausgabe",
      "display": "text"
    },
    "ddc": {
      "field": "ddc_string",
      "label": "DDC",
      "display": "text"
    },
    "url": {
      "field": "url_string",
      "label": "URL",
      "display": "link"
    }
  },
};
