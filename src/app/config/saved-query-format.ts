import { QueryFormat } from "app/config/query-format";

export class SavedQueryFormat {

    name: string;
    query: QueryFormat;

    constructor(name: string, query: QueryFormat) {
        this.name = name;
        this.query = query;
    }
}