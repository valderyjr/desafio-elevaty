export class PaginatedEntity<T> {
  data: T[];
  total: number;
  pages: number;
}
