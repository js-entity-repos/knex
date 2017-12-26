import facadeTest from '@js-entity-repos/core/dist/tests';
import { TestEntity, TestId } from '@js-entity-repos/core/dist/tests/utils/testEntity';
import { config } from 'dotenv';
import 'mocha'; // tslint:disable-line:no-import-side-effect
import facade from './facade';
import connectToDb from './utils/connectToDb';
config();

const db = connectToDb({
  client: 'mysql',
  connection: {
    database: process.env.KNEX_DATABASE,
    host: '127.0.0.1',
    ...(process.env.KNEX_PASSWORD === undefined ? {} : {
      password: process.env.KNEX_PASSWORD,
    }),
    user: process.env.KNEX_USER,
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
