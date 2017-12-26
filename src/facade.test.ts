import facadeTest from '@js-entity-repos/core/dist/tests';
import { TestEntity, TestId } from '@js-entity-repos/core/dist/tests/utils/testEntity';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import facade from './facade';
import connectToDb from './utils/connectToDb';

const db = connectToDb({
  client: 'mysql',
  connection: {
    database: 'jsentityreposknex',
    host: '127.0.0.1',
    password: 'pword',
    user: 'jsentityrepos',
  },
});

const tableName = 'testentities';

before(async () => {
  await Promise.resolve(db.schema.dropTableIfExists(tableName));
  await Promise.resolve(db.schema.createTableIfNotExists(tableName, async (table) => {
    table.string('id').unique();
    table.string('stringProp');
    table.float('numberProp');
    table.boolean('booleanProp');
  }));
});

facadeTest(facade<TestId, TestEntity>({
  constructDocument: (id, patch) => ({ ...patch, ...id }),
  constructEntity: (document) => document,
  db,
  entityName: 'Test Entity',
  tableName,
}));
