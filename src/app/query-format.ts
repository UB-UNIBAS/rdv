export class QueryFormat {
    searchFields = {
        "search1": {
            "value": "",
            "field": "all_text"
        },
        "search2": {
            "value": "",
            "field": "ti_all_text"
        },
        "search3": {
            "value": "",
            "field": "person_all_text"
        }
    };

    facetFields = {
        "language": {
            "values": [],
            "operators": ["OR", "AND"],
            "operator": "AND",
            "field": "language_all_facet",
            "label": "Sprache"
        },
        "doctype": {
            "values": [],
            "field": "doctype_string",
            "operators": ["OR"],
            "operator": "OR",
            "label": "Dokumenttyp"
        }
    };

    rangeFields = {
        "year": {
            "min": 1950,
            "from": 1950,
            "to": 2017,
            "max": 2017,
            "field": "py_int",
            "label": "Jahr",
            "showMissingValues": true
        },
        "pages": {
            "min": 1,
            "from": 1,
            "to": 20,
            "max": 20,
            "field": "pages_int",
            "label": "Seitenanzahl",
            "showMissingValues": true
        }
    };

    queryParams = {
        "rows": 10,
        "start": 0,
        "sortField": "id_int",
        "sortDir": "asc",
        "fl": ["id", "person_all_string", "ti_all_string", "py_string"]
    };

    constructor() { }
}