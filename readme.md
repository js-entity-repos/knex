# knex
> A concrete implementation of js-entity-repos for knex.

### Usage
1. Install it with `npm i @js-entity-repos/knex`.
1. For each entity you will need to do the following.
    1. [Create Id and Entity interfaces](#id-and-entity-interface).
    1. [Create a facade config](#facade-config).
    1. [Construct the facade with the config and interfaces](#calling-the-facade).
    1. [Use the facade](https://github.com/js-entity-repos/core/blob/master/docs/facade.md).

### Id and Entity Interface

```ts
export interface TodoId {
  readonly id: string;
}

export interface TodoEntity extends TodoId {
  readonly description: string;
  readonly completed: boolean;
}
```

### Facade Config

```ts
import FacadeConfig from '@js-entity-repos/knex/dist/Config';
import connectToDb from '@js-entity-repos/knex/dist/utils/connectToDb';

const todoFacadeConfig: FacadeConfig = {
  constructDocument: (id, patch) => {
    // Converts an entity to a document for the database.
    return { ...patch, ...id }
  },
  constructEntity: (document) => {
    // Converts a document from the database to an entity.
    return document;
  },
  db: connectToDb({
    client: 'mysql',
    connection: {
      database: 'todoapp',
      host: '127.0.0.1',
      password: 'pword',
      user: 'todouser',
    },
  }),
  entityName: 'todo',
  tableName: 'todos',
};
```

### Construct the Facade

```ts
import facade from '@js-entity-repos/knex/dist/facade';

const todosFacade = facade<TodoId, TodoEntity>(todoFacadeConfig);
```
