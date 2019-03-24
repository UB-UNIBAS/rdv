export const environment = {

  production: false,

  backend: "elastic",

  // unter welcher Domaine (und Verzeichnis) läuft der RDV (wird benutzt um Links zu generieren)
  baseUrl: "http://localhost:4200",

  //Wo liegt Proxy-Skript, das mit Elasticsearch spricht?
  proxyUrl: "http://localhost/unibas/php-proxy/angularx_elasticsearch_proxy_unibas.php",

  //Welche Felder sind durchsuchbar, Anzahl der Felder in preselect regelt wie viele Suchfelder erscheinen
  searchFields: {
    "options": {
      "all_text": "Freitext",
      "Titel": "Titel",
      "Person": "Person",
      "Beschreibung": "Beschreibung"

    },
    "preselect": ["all_text", "Titel", "Person"]
  },

  //Infos zu Filtern (z.B. Filterung nach Einrichtung)
  filterFields: {
    "ort": {
      "label": "Ort",
      "field": "Ort.keyword",
      "options": [
        {
          "value": "Freiburg",
          "label": "Freiburg"
        },
        {
          "value": "Basel",
          "label": "Basel"
        },
        {
          "value": "Strasbourg",
          "label": "Strasbourg"
        }
      ]
    },
    "material": {
      "label": "Material",
      "field": "Material.keyword",
      "options": [
        {
          "value": "Holz",
          "label": "Holz"
        },
        {
          "value": "Stein",
          "label": "Stein"
        },
        {
          "value": "Glas",
          "label": "Glas"
        }
      ]
    }
  },

  //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
  //order gilt fuer Facetten und Ranges
  facetFields: {
    "doctype": {
      "field": "Dokumenttyp.keyword",
      "label": "Dokumenttyp",
      "operators": ["OR"],
      "operator": "OR",
      "order": 2
    },
    "language": {
      "field": "Sprache.keyword",
      "label": "Sprache",
      "operators": ["OR", "AND"],
      "operator": "OR",
      "order": 1
    },
    "topic": {
      "field": "Thema.keyword",
      "label": "Thema",
      "operators": ["OR", "AND"],
      "operator": "OR",
      "order": 4
    }
  },

  //Infos zu Ranges (z.B. Label)
  //order gilt fuer Facetten und Ranges
  rangeFields: {
    "year": {
      "field": "Jahr",
      "label": "Jahr",
      "order": 3,
      "min": 1990,
      "from": 1990,
      "to": 2005,
      "max": 2005,
      "showMissingValues": true
    },
    "pages": {
      "field": "Seiten",
      "label": "Seitenzahl",
      "order": 5,
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
      "field": "Person",
      "label": "Person",
      "sort": "Person.keyword",
      "css": "col-sm-2 col-lg-2 text-left",
    },
    {
      "field": "Titel",
      "label": "Titel",
      "sort": "Titel.keyword",
      "css": "col-sm-2 col-lg-2 text-left",
    },
    {
      "field": "Sprache",
      "label": "Sprache",
      "sort": "Sprache.keyword",
      "css": "col-sm-2 col-lg-2 text-left",
    },
    /*
     {
         "field": "Beschreibung",
         "label": "Beschreibung",
         "sort": "Beschreibung.keyword",
         "css": "col-sm-4 col-lg-4 text-left",
     },
     {
         "field": "Dokumenttyp",
         "label": "Dokumenttyp",
         "sort": "Dokumenttyp.keyword",
         "css": "col-sm-4 col-lg-4 text-left",
     },
     {
         "field": "Ort",
         "label": "Ort",
         "sort": "Ort.keyword",
         "css": "col-sm-4 col-lg-4 text-left",
     },
     */
    {
      "field": "Jahr",
      "label": "Jahr",
      "sort": "Jahr",
      "css": "col-sm-2 col-lg-2 text-left",
    }

  ],

  //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
  extraInfos: {
    "ort": {
      "field": "Ort",
      "label": "Ort",
      "display": "text"
    }
  },
};
