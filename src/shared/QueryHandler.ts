export abstract class Query {}

export interface QueryHandler<T> {
  handle(query: Query): Promise<T>;
}