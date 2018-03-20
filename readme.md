# knex
> A concrete implementation of js-entity-repos for knex.

### Usage
1. Install it with `npm i @js-entity-repos/knex`.
1. For each entity you will need to do the following.
    1. [Create an Entity interface](#entity-interface).
    1. [Construct the facade](#construct-the-facade).
    1. [Use the facade](https://github.com/js-entity-repos/core/blob/master/docs/facade.md).

### Entity Interface

```ts
import Entity from '@js-entity-repos/core/dist/types/Entity';

export interface TodoEntity extends Entity {
  readonly description: string;
  readonly completed: boolean;
}
```

### Construct the Facade

```ts
import factory from '@js-entity-repos/knex/dist/factory';
import connectToDb from '@js-entity-repos/knex/dist/utils/connectToDb';

const todosFacade = factory<TodoEntity>({
  // Optional property to convert an entity to a DB document. Defaults to the function below.
  constructDocument: (patch) => {
    return patch;
  },
  // Optional property to convert a DB document to an entity. Defaults to the function below.
  constructEntity: (document) => {
    return document;
  },
  // Optional property to convert an entity filter to a DB filter. Defaults to the function below.
  constructFilter: (filter) => {
    return filter;
  },
  // Optional property to convert an entity sort to a DB sort. Defaults to the function below.
  constructSort: (sort) => {
    return sort;
  }.
  db: connectToDb({
    client: 'mysql',
    connection: {
      database: 'todoapp',
      host: '127.0.0.1',
      password: 'pword',
      user: 'todouser',
    },
  }),
  // Optional property. Defaults to 10.
  defaultPaginationLimit: 10,
  entityName: 'todo',
  // Optional property. Defaults to the entityName.
  tableName: 'todos',
});
```
