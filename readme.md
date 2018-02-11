# knex
> A concrete implementation of js-entity-repos for knex.

### Usage
1. Install it with `npm i @js-entity-repos/knex`.
1. For each entity you will need to do the following.
    1. [Create an Entity interface](#entity-interface).
    1. [Create a factory config](#factory-config).
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

### Factory Config

```ts
import FactoryConfig from '@js-entity-repos/knex/dist/FactoryConfig';
import connectToDb from '@js-entity-repos/knex/dist/utils/connectToDb';

const todoFactoryConfig: FactoryConfig<TodoEntity> = {
  constructDocument: (patch) => {
    // Optional property that converts an entity to a document for the database.
    return patch;
  },
  constructEntity: (document) => {
    // Optional property that converts a document from the database to an entity.
    return document;
  },
  constructFilter: (filter) => {
    // Optional property that converts an entity filter to a filter for the DB.
    return filter;
  },
  constructSort: (sort) => {
    // Optional property that converts an entity sort to a sort for the DB.
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
  defaultPaginationLimit: 100, // Optional property.
  entityName: 'todo',
  tableName: 'todos',
};
```

### Construct the Facade

```ts
import factory from '@js-entity-repos/knex/dist/factory';

const todosFacade = factory(todoFactoryConfig);
```
