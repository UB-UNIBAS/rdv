import { QueryFormat } from '../../shared/models/query-format';

export interface SavedQuery {
  id: string;
  name: string;
  query: QueryFormat;
}
