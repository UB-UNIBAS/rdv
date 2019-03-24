export const environment = {

  production: false,

  backend: "elastic",

  // unter welcher Domaine (und Verzeichnis) läuft der RDV (wird benutzt um Links zu generieren)
  baseUrl: "http://localhost:4200",

  //Wo liegt Proxy-Skript, das mit Elasticsearch spricht?
  proxyUrl: "http://afrikaportal:UbBaSeL@ub-afrikaportal.ub.unibas.ch/unibas/php-proxy/angularx_elasticsearch_proxy_unibas.php",

  //Welche Felder sind durchsuchbar, Anzahl der Felder in preselect regelt wie viele Suchfelder erscheinen
  searchFields: {
    "options": {
      "all_text": "Freitext",
      "Titel": "Titel",
      "fct_location.search": "Ort",
      "Verlag": "Verlag"
    },
    "preselect": ["all_text", "Titel", "Verlag"]
  },

  //Infos zu Filtern (z.B. Filterung nach Einrichtung)
  filterFields: {
    "institution": {
      "label": "Ort",
      "field": "hidden_analysis_fct_location",
      "options": [
        {
          "value": "Ort",
          "label": "Ort"
        },
        {
          "value": "Druckort",
          "label": "Druckort"
        },
        {
          "value": "Aushangsort",
          "label": "Aushangsort"
        }
      ]
    },
    "type": {
      "label": "Typ",
      "field": "fct_type",
      "options": [
        {
          "value": "Apartheid",
          "label": "Apartheid"
        },
        {
          "value": "Kunst",
          "label": "Kunst"
        },
        {
          "value": "Widerstand",
          "label": "Widerstand"
        }
      ]
    }
  },

  //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
  //order gilt fuer Facetten und Ranges
  facetFields: {
    "topic": {
      "field": "fct_topic",
      "label": "Topic",
      "operators": ["OR", "AND"],
      "operator": "AND",
      "order": 2
    },
    "country": {
      "field": "fct_countrycode",
      "label": "Country",
      "operators": ["OR"],
      "operator": "OR",
      "order": 3
    }
  },

  //Infos zu Ranges (z.B. Label)
  //order gilt fuer Facetten und Ranges
  rangeFields: {
    "year": {
      "field": "fct_year",
      "label": "Jahr",
      "order": 1,
      "min": 1950,
      "from": 1950,
      "to": 2018,
      "max": 2018,
      "showMissingValues": true

    },
  },

//Optionen fuer Anzahl der Treffer Treffertabelle
  rowOpts: [5, 10, 20, 50],

  queryParams: {
    "rows": 10, // 5, 10, 20, 50
    "start": 0,
    "sortField": "_uid",
    "sortDir": "asc"
  },

  //Config fuer Merkliste
  basketConfig: {
    "queryParams": {
      "rows": 10,
      "sortField": "_uid",
      "sortDir": "asc"
    }
  },

  showExportList: {
    "basket": true,
    "table": false
  },

  //Tabellenspalten mit Sortierkriterium (Solr-Feld oder false)
  tableFields: [
    {
      "field": "id",
      "label": "ID",
      "sort": "_uid",
      "css": "col-sm-2 col-lg-1 flex-sm-column align-items-center text-sm-center",
      "extraInfo": true,
      "landingpage": true,
    },
    {
      "field": "hidden_analysis_fct_location",
      "label": "Region",
      "sort": "hidden_analysis_fct_location",
      "css": "col-sm-2 col-lg-2 text-left",
    },
    {
      "field": "Titel",
      "label": "Titel",
      "sort": "Titel.keyword",
      "css": "col-sm-5 col-lg-6 text-left",
    },
    {
      "field": "fct_year",
      "label": "Jahr",
      "sort": "fct_year",
      "css": "col-sm-2 col-lg-2 text-left",
    }

  ],

  //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
  extraInfos: {
    "date": {
      "field": "Anfangsdatum",
      "label": "Anfangsdatum",
      "display": "text"
    },
    "number": {
      "field": "Inventarnummer",
      "label": "Inventarnummer",
      "display": "text"
    }
  },
};
