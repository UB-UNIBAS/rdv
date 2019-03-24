export interface Basket {
  id: string;
  name: string;
  ids: string[];
  queryParams: {
    rows: number;
    start: number;
    sortField: string;
    sortDir: string;
  };
}
