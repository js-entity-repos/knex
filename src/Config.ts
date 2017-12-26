import * as knex from 'knex';

export type Document = any;

export default interface Config<Id, Entity> {
  readonly constructDocument: (id: Id, patch: Partial<Entity>) => Document;
  readonly constructEntity: (document: Document) => Entity;
  readonly db: knex;
  readonly entityName: string;
  readonly tableName: string;
}
