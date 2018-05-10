import Entity from '@js-entity-repos/core/dist/types/Entity';
import Filter from '@js-entity-repos/core/dist/types/Filter';
import Sort from '@js-entity-repos/core/dist/types/Sort';
import * as knex from 'knex';

export type Document = any;

export default interface FacadeConfig<E extends Entity> {
  readonly constructDocument: (patch: Partial<E>) => Document;
  readonly constructEntity: (document: Document) => E;
  readonly constructFilter: (filter: Filter<E>) => any;
  readonly constructQuery: (table: knex.QueryBuilder) => knex.QueryBuilder;
  readonly constructSort: (sort: Sort<E>) => any;
  readonly db: () => Promise<knex>;
  readonly defaultPaginationLimit: number;
  readonly entityName: string;
  readonly tableName: string;
}
