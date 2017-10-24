export class MainConfig {

    //Welche Felder sind durchsuchbar
    searchFields = {
        "all_text": "Freitext",
        "ti_all_text": "Titel",
        "person_all_text": "Person",
    };

    //Infos zu Facetten (z.B. mit welchen Operatoren die Facettenwere einer Facette verknuepft werden koennen)
    //order gilt fuer Facetten und Ranges
    facetFields = {};

    //Infos zu Ranges (z.B. Label)
    //order gilt fuer Facetten und Ranges
    rangeFields = {
        "year": {
            "label": "Jahr",
            "order": 1
        }
    };

    //Optionen fuer Anzahl der Treffer Treffertabelle
    rowOpts = [5, 10, 20, 50];

    //Tabellenspalten mit Sortierkriterium (Solr-Feld oder false)
    tableFields = [
        {
            "field": "id",
            "label": "ID",
            "multi": false,
            "sort": "id_int",
            "css": "col-sm-2 col-lg-2 flex-sm-column align-items-center text-sm-center",
        },
        {
            "field": "person_all_string",
            "label": "Person",
            "multi": true,
            "sort": "person_sort_string",
            "css": "col-sm-3 col-lg-3 text-left",
        },
        {
            "field": "ti_all_string",
            "label": "Titel",
            "multi": true,
            "sort": "ti_sort_string",
            "css": "col-sm-4 col-lg-5 text-left",
        },
        {
            "field": "py_int",
            "label": "Jahr",
            "multi": false,
            "sort": "py_int",
            "css": "col-sm-2 col-lg-1 text-sm-center",
        }
    ];

    //Welche Felder sollen in zusaetzlicher Zeile angezeigt werden
    extraInfos = {
        "url": {
            "field": "url_all_string",
            "label": "URL"
        }
    };

    //Anzahl der Treffer pro Seite in Merklisten-Treffertabelle
    basketRows = 10;

    //Wo liegt Proxy-Skript, das mit Solr spricht?
    proxyUrl = "http://localhost/mh1018/test/php/solr/angularx_solr_proxy_bwsts.php";

    //BWSTS-Filter
    filterFields = {
        "institution": {
            "label": "Einrichtung",
            "data": [
                {
                    "value": 1,
                    "label": "Hohenheim"
                },
                {
                    "value": 2,
                    "label": "Heidelberg"
                },
                {
                    "value": 3,
                    "label": "Freiburg"
                }
            ]
        }
    }
}